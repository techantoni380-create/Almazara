<?php
declare(strict_types=1);
require __DIR__.'/bootstrap.php';
require __DIR__.'/commerce.php';
$action=$_GET['action']??'';
if(!is_string($action))fail('invalid');
if($action==='webhook')handle_webhook();
if($action==='status'){
 if($_SERVER['REQUEST_METHOD']!=='GET')fail('method',405);start_session();$c=config();
 output(['ok'=>true,'csrf'=>$_SESSION['csrf'],'newsletter'=>!empty($c['newsletter_enabled'])&&mail_ready(),'contact'=>!empty($c['contact_enabled'])&&mail_ready(),'payments'=>payments_ready()]);
}
if(in_array($action,['confirm','unsubscribe'],true)){
 if(!config())fail('unavailable',503);
 $token=$_GET['token']??$_POST['token']??'';if(!is_string($token)||!preg_match('/^[a-f0-9]{64}$/D',$token))fail('invalid');
 $column=$action==='confirm'?'token_hash':'unsubscribe_hash';
 $row=query('SELECT * FROM newsletter WHERE '.$column.'=?',[hash('sha256',$token)])->fetch();$l=lang($row['lang']??'ES');$t=email_copy($l);$valid=$row&&($action==='unsubscribe'||($row['state']==='pending'&&(int)$row['expires']>=time()));
 $message=$valid?($action==='confirm'?$t[0]:$t[6]):$t[8];$done=false;
 if($_SERVER['REQUEST_METHOD']==='POST'){
  csrf();if($valid){
   if($action==='confirm')query("UPDATE newsletter SET state='subscribed', confirmed=?, token_hash=NULL WHERE email=? AND state='pending'",[time(),$row['email']]);
   else query("UPDATE newsletter SET state='unsubscribed', token_hash=NULL, expires=0 WHERE email=?",[$row['email']]);
   $message=$action==='confirm'?$t[5]:$t[7];$done=true;
  }
 }elseif($_SERVER['REQUEST_METHOD']!=='GET')fail('method',405);
 start_session();header('Content-Type: text/html; charset=utf-8');header('X-Robots-Tag: noindex, nofollow');
 $esc=fn($s)=>htmlspecialchars((string)$s,ENT_QUOTES,'UTF-8');
 echo '<!doctype html><html lang="'.strtolower($l).'"><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"><title>ALMAZARA</title><style>body{margin:0;background:#f6f1e7;color:#293a22;font:18px/1.7 Georgia,serif;min-height:100vh;display:grid;place-items:center}main{box-sizing:border-box;max-width:620px;width:100%;padding:40px 24px;text-align:center}h1{font-weight:400;letter-spacing:.15em}button{background:#2e3d1f;color:#f1dfb2;border:1px solid #c4a962;padding:16px 30px;font-size:16px;cursor:pointer}a{color:inherit}p{margin:24px 0}</style><main><h1>ALMAZARA</h1><p>'.$esc($message).'</p>';
 if($valid&&!$done)echo '<form method="post"><input type="hidden" name="token" value="'.$esc($token).'"><input type="hidden" name="csrf" value="'.$esc($_SESSION['csrf']).'"><button>'.$esc($action==='confirm'?$t[4]:$t[6]).'</button></form>';
 echo '<p><a href="'.$esc(base_url().'/index.html').'">'.$esc($t[9]).'</a></p></main></html>';exit;
}
if($action==='order'){
 if($_SERVER['REQUEST_METHOD']!=='GET')fail('method',405);$id=$_GET['id']??'';if(!is_string($id)||!preg_match('/^[a-f0-9]{64}$/D',$id))fail('invalid');
 $row=query('SELECT status,total,subtotal,shipping,currency,cart,prices FROM orders WHERE id=?',[$id])->fetch();if(!$row)fail('order',404);
 output(['ok'=>true,'status'=>$row['status'],'total'=>(int)$row['total'],'currency'=>$row['currency'],'cart'=>json_decode($row['cart'],true),'prices'=>json_decode($row['prices'],true),'subtotal'=>(int)$row['subtotal'],'shipping'=>(int)$row['shipping']]);
}
$data=input();
if($action==='quote'){if(!payments_ready())fail('payment_unavailable',503);$q=quote($data['cart']??null);unset($q['lines']);output(['ok'=>true]+$q);}
if($action==='checkout')create_checkout($data);
if(!in_array($action,['newsletter','contact'],true))fail('not_found',404);
$c=config();if(empty($c[$action.'_enabled'])||!mail_ready())fail('unavailable',503);
if(($data['consent']??false)!==true)fail('consent');
if(!empty($data['website']))output(['ok'=>true]);
$email=$data['email']??'';if(!is_string($email)||strlen($email)>254||!filter_var($email,FILTER_VALIDATE_EMAIL))fail('email');$email=strtolower(trim($email));
limit($action.'-ip',5,3600);limit($action.'-email',3,86400,$email);
if($action==='newsletter'){
 $l=lang($data['lang']??'ES');$row=query('SELECT state,last_sent,created FROM newsletter WHERE email=?',[$email])->fetch();
 // Generic response avoids exposing whether an address is already subscribed.
 if($row&&($row['state']==='subscribed'||(int)$row['last_sent']>time()-600))output(['ok'=>true]);
 $token=bin2hex(random_bytes(32));$unsubscribe=hash_hmac('sha256','unsubscribe|'.$email,$c['app_key']);$now=time();
 if($row)query("UPDATE newsletter SET lang=?,state='pending',token_hash=?,unsubscribe_hash=?,expires=?,confirmed=NULL,last_sent=0,consent_version='newsletter-v1' WHERE email=?",[$l,hash('sha256',$token),hash('sha256',$unsubscribe),$now+86400,$email]);
 else query('INSERT INTO newsletter (email,lang,state,token_hash,unsubscribe_hash,expires,created,confirmed,last_sent,consent_version) VALUES (?,?,?,?,?,?,?,NULL,0,?)',[$email,$l,'pending',hash('sha256',$token),hash('sha256',$unsubscribe),$now+86400,$now,'newsletter-v1']);
 $t=email_copy($l);$confirm=base_url().'/api/index.php?action=confirm&token='.$token;$cancel=base_url().'/api/index.php?action=unsubscribe&token='.$unsubscribe;
 send_mail($email,$t[0],"ALMAZARA\n\n".$t[1]."\n".$confirm."\n\n".$t[2]."\n\n".$t[3]."\n".$cancel);
 query('UPDATE newsletter SET last_sent=? WHERE email=?',[$now,$email]);output(['ok'=>true]);
}
$name=$data['name']??'';$message=$data['message']??'';$phone=$data['phone']??'';
if(!is_string($name)||mb_strlen(trim($name))<2||mb_strlen($name)>100||!is_string($message)||mb_strlen(trim($message))<5||mb_strlen($message)>5000||!is_string($phone)||strlen($phone)>40)fail('invalid');
$to=$c['contact_to']??'';if(!filter_var($to,FILTER_VALIDATE_EMAIL))fail('unavailable',503);
send_mail($to,'Consulta desde la web · ALMAZARA',"Nombre: ".$name."\nEmail: ".$email."\nTeléfono: ".$phone."\n\n".$message,$email);
output(['ok'=>true]);
