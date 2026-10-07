<?php
declare(strict_types=1);
function catalog(): array {
 // Server is authoritative. Never accept price, currency, shipping or discount from a browser.
 return [
 'aceite-premium-500'=>['name'=>'Aceite de oliva · 500 ml','cents'=>2200],
 'aceite-premium-125'=>['name'=>'Aceite de oliva · 125 ml','cents'=>1500],
 'pack-3-aceites'=>['name'=>'Pack 3 × 500 ml','cents'=>6000],
 'pack-6-aceites'=>['name'=>'Pack 6 × 500 ml','cents'=>11400],
 'pack-12-aceites'=>['name'=>'Pack 12 × 500 ml','cents'=>21600],
 'jamon-iberico'=>['name'=>'Jamón ibérico · pieza','cents'=>50000,'confirm'=>true],
 'paleta-iberica'=>['name'=>'Paleta ibérica · pieza','cents'=>16900,'confirm'=>true],
 ];
}
function quote($cart): array {
 if(!is_array($cart)||count($cart)<1||count($cart)>7)fail('cart');
 $all=catalog();$c=config();$subtotal=0;$lines=[];
 foreach($cart as $id=>$qty){
  if(!isset($all[$id])||!is_int($qty)||$qty<1||$qty>99)fail('cart');
  $p=$all[$id];if(!empty($p['confirm'])&&empty($c['prices_confirmed'][$id]))fail('price_pending',409);
  $subtotal+=$p['cents']*$qty;$lines[]=['price_data'=>['currency'=>'chf','product_data'=>['name'=>$p['name']],'unit_amount'=>$p['cents']],'quantity'=>$qty];
 }
 $free=count($cart)===1&&isset($cart['pack-12-aceites']);$shipping=$free?0:($c['shipping_ch_cents']??null);
 if(!is_int($shipping)||$shipping<0)fail('shipping_pending',409);
 if($subtotal+$shipping>99999999)fail('cart');
 return ['subtotal'=>$subtotal,'shipping'=>$shipping,'total'=>$subtotal+$shipping,'currency'=>'CHF','lines'=>$lines];
}
function payments_ready(): bool {$c=config();return !empty($c['payments_enabled'])&&!empty($c['stripe_secret_key'])&&!empty($c['stripe_webhook_secret'])&&!empty($c['sale_terms_confirmed']);}
function stripe_post(array $data,string $key): array {
 $curl=curl_init('https://api.stripe.com/v1/checkout/sessions');
 curl_setopt_array($curl,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>http_build_query($data),CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>20,CURLOPT_CONNECTTIMEOUT=>8,CURLOPT_HTTPHEADER=>['Authorization: Bearer '.config()['stripe_secret_key'],'Idempotency-Key: '.$key,'Stripe-Version: 2024-06-20','Content-Type: application/x-www-form-urlencoded'],CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2]);
 $response=curl_exec($curl);$status=curl_getinfo($curl,CURLINFO_HTTP_CODE);curl_close($curl);
 $body=is_string($response)?json_decode($response,true):null;
 if($status!==200||!is_array($body)||empty($body['id'])||empty($body['url']))fail('payment_unavailable',503);
 if(parse_url($body['url'],PHP_URL_HOST)!=='checkout.stripe.com'||!str_starts_with($body['url'],'https://'))fail('payment_unavailable',503);
 return $body;
}
function create_checkout(array $data): never {
 if(!payments_ready())fail('payment_unavailable',503);
 if(($data['consent']??false)!==true)fail('consent');
 $cart=$data['cart']??null;$q=quote($cart);limit('checkout',12,3600);
 $request=$data['request_id']??'';if(!is_string($request)||!preg_match('/^[a-f0-9-]{32,40}$/D',$request))fail('invalid');
 // Same browser request and cart always map to the same order and Stripe idempotency key.
 ksort($cart);$id=hash_hmac('sha256',session_id().'|'.$request.'|'.json_encode($cart),config()['app_key']);
 $existing=query('SELECT * FROM orders WHERE id=?',[$id])->fetch();
 if($existing&&$existing['status']==='paid')output(['ok'=>true,'paid'=>true,'order'=>$id]);
 if($existing&&((int)$existing['total']!==$q['total']||json_decode($existing['cart'],true)!==$cart))fail('changed',409);
 if(!$existing){$prices=[];foreach($cart as $product=>$qty)$prices[$product]=catalog()[$product]['cents'];query('INSERT INTO orders (id,cart,prices,subtotal,shipping,total,currency,status,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?)',[$id,json_encode($cart),json_encode($prices),$q['subtotal'],$q['shipping'],$q['total'],'CHF','pending',time(),time()]);}
 $params=['mode'=>'payment','payment_method_types'=>['card'],'client_reference_id'=>$id,'metadata'=>['order_id'=>$id],'line_items'=>$q['lines'],'locale'=>strtolower(lang($data['lang']??'ES')),'success_url'=>base_url().'/checkout.html?order='.$id,'cancel_url'=>base_url().'/checkout.html?cancelled=1','shipping_address_collection'=>['allowed_countries'=>['CH']],'shipping_options'=>[['shipping_rate_data'=>['type'=>'fixed_amount','fixed_amount'=>['amount'=>$q['shipping'],'currency'=>'chf'],'display_name'=>'Envío · Versand · Livraison · Spedizione · Shipping']]]];
 $session=stripe_post($params,'almazara-'.$id);
 query('UPDATE orders SET stripe_session=?, updated=? WHERE id=?',[$session['id'],time(),$id]);
 output(['ok'=>true,'url'=>$session['url'],'order'=>$id]);
}
function verified_event(string $body,string $signature,string $secret): ?array {
 if(!$secret)return null;$timestamp=null;$signatures=[];
 foreach(explode(',',$signature) as $part){$pair=explode('=',trim($part),2);if(count($pair)!==2)continue;if($pair[0]==='t'&&preg_match('/^[0-9]+$/D',$pair[1]))$timestamp=(int)$pair[1];if($pair[0]==='v1')$signatures[]=$pair[1];}
 if(!$timestamp||abs(time()-$timestamp)>300)return null;
 $expected=hash_hmac('sha256',$timestamp.'.'.$body,$secret);$valid=false;foreach($signatures as $sig)$valid=hash_equals($expected,$sig)||$valid;
 if(!$valid)return null;$event=json_decode($body,true);return is_array($event)?$event:null;
}
function handle_webhook(): never {
 if($_SERVER['REQUEST_METHOD']!=='POST')fail('method',405);
 if((int)($_SERVER['CONTENT_LENGTH']??0)>1048576)fail('invalid',413);
 $body=file_get_contents('php://input',false,null,0,1048577);if(strlen($body)>1048576)fail('invalid',413);
 $c=config();if(empty($c['stripe_webhook_secret']))fail('unavailable',503);
 $e=verified_event($body,$_SERVER['HTTP_STRIPE_SIGNATURE']??'',$c['stripe_webhook_secret']);if(!$e)fail('signature',400);
 if(!in_array($e['type']??'', ['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.expired'],true))output(['ok'=>true]);
 $s=$e['data']['object']??[];$id=$s['metadata']['order_id']??'';
 if(!is_string($id)||!preg_match('/^[a-f0-9]{64}$/D',$id))fail('order',400);
 $order=query('SELECT * FROM orders WHERE id=?',[$id])->fetch();if(!$order)fail('order',400);
 if(empty($order['stripe_session']))fail('retry',503); // A webhook may arrive before the create response is stored.
 if(($s['id']??'')!==$order['stripe_session']||($s['client_reference_id']??'')!==$id||($s['currency']??'')!=='chf'||($s['amount_total']??-1)!==(int)$order['total'])fail('mismatch',400);
 $live=str_starts_with($c['stripe_secret_key']??'','sk_live_');if(($e['livemode']??null)!==$live)fail('mismatch',400);
 if(!is_string($e['id']??null)||strlen($e['id'])>255)fail('invalid');
 if(query('SELECT id FROM webhook_events WHERE id=?',[$e['id']])->fetch())output(['ok'=>true]);
 $db=db();$db->beginTransaction();
 try{
  query('INSERT INTO webhook_events (id,received) VALUES (?,?)',[$e['id'],time()]);
  if(($s['payment_status']??'')==='paid'&&$e['type']!=='checkout.session.expired')query("UPDATE orders SET status='paid',updated=? WHERE id=? AND status <> 'paid'",[time(),$id]);
  elseif($e['type']==='checkout.session.expired')query("UPDATE orders SET status='expired',updated=? WHERE id=? AND status='pending'",[time(),$id]);
  $db->commit();
 }catch(PDOException $e){$db->rollBack();if(!in_array((string)$e->getCode(),['23000','19'],true))throw $e;}
 output(['ok'=>true]);
}
