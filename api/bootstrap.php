<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
function fail(string $code, int $status = 400): never {http_response_code($status);header('Content-Type: application/json; charset=utf-8');echo json_encode(['ok'=>false,'code'=>$code]);exit;}
function output(array $data): never {header('Content-Type: application/json; charset=utf-8');echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
set_exception_handler(function(Throwable $e){error_log('ALMAZARA backend error: '.get_class($e).' at '.basename($e->getFile()).':'.$e->getLine());fail('unavailable',503);});
function config(): array {
 static $c=null;if($c!==null)return $c;
 $path=dirname(__DIR__,2).'/almazara-private/config.php';
 if(!is_file($path))return $c=[];
 $c=require $path;
 if(!is_array($c)||strlen((string)($c['app_key']??''))<32) return $c=[];
 $url=parse_url($c['base_url']??'');
 // HTTP is accepted solely for loopback development, never for public deployments.
 if(!$url||!isset($url['host'])||(($url['scheme']??'')!=='https'&&!in_array($url['host'],['127.0.0.1','localhost'],true)))return $c=[];
 return $c;
}
function base_url(): string {return rtrim(config()['base_url']??'', '/');}
function start_session(): void {
 if(session_status()===PHP_SESSION_ACTIVE)return;
 session_name('almazara_session');
 session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>str_starts_with(base_url(),'https://'),'httponly'=>true,'samesite'=>'Lax']);
 ini_set('session.use_strict_mode','1');session_start();
 if(empty($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(32));
}
function csrf(): void {
 start_session();$provided=$_SERVER['HTTP_X_CSRF_TOKEN']??$_POST['csrf']??'';
 if(!is_string($provided)||!hash_equals($_SESSION['csrf'],$provided))fail('csrf',403);
 $origin=$_SERVER['HTTP_ORIGIN']??'';
 if($origin!==''){$u=parse_url(base_url());$expected=$u['scheme'].'://'.$u['host'].(isset($u['port'])?':'.$u['port']:'');if(!hash_equals($expected,$origin))fail('csrf',403);}
}
function input(): array {
 if($_SERVER['REQUEST_METHOD']!=='POST')fail('method',405);
 if((int)($_SERVER['CONTENT_LENGTH']??0)>16384)fail('invalid',413);
 csrf();$body=file_get_contents('php://input',false,null,0,16385);
 if(strlen($body)>16384)fail('invalid',413);
 $data=json_decode($body,true);if(!is_array($data))fail('invalid');return $data;
}
function lang($code): string {$code=strtoupper(is_string($code)?$code:'ES');return in_array($code,['ES','DE','FR','IT','EN'],true)?$code:'ES';}
function db(): PDO {
 static $db=null;if($db)return $db;$c=config();if(empty($c['db']['dsn']))fail('unavailable',503);
 $db=new PDO($c['db']['dsn'],$c['db']['user']??null,$c['db']['password']??null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
 if($db->getAttribute(PDO::ATTR_DRIVER_NAME)==='sqlite')$db->exec('PRAGMA busy_timeout=5000');
 $db->exec('CREATE TABLE IF NOT EXISTS newsletter (email VARCHAR(254) PRIMARY KEY, lang VARCHAR(2) NOT NULL, state VARCHAR(16) NOT NULL, token_hash VARCHAR(64), unsubscribe_hash VARCHAR(64), expires BIGINT NOT NULL, created BIGINT NOT NULL, confirmed BIGINT, last_sent BIGINT NOT NULL, consent_version VARCHAR(32) NOT NULL)');
 $db->exec('CREATE TABLE IF NOT EXISTS orders (id VARCHAR(64) PRIMARY KEY, cart TEXT NOT NULL, prices TEXT NOT NULL, subtotal BIGINT NOT NULL, shipping BIGINT NOT NULL, total BIGINT NOT NULL, currency VARCHAR(3) NOT NULL, status VARCHAR(24) NOT NULL, stripe_session VARCHAR(255), created BIGINT NOT NULL, updated BIGINT NOT NULL)');
 $db->exec('CREATE TABLE IF NOT EXISTS webhook_events (id VARCHAR(255) PRIMARY KEY, received BIGINT NOT NULL)');
 $db->exec('CREATE TABLE IF NOT EXISTS rate_limits (id VARCHAR(64) PRIMARY KEY, hits INT NOT NULL, expires BIGINT NOT NULL)');
 return $db;
}
function query(string $sql,array $params=[]): PDOStatement {$q=db()->prepare($sql);$q->execute($params);return $q;}
function limit(string $bucket,int $max,int $seconds,string $identity=''): void {
 $now=time();$window=(int)floor($now/$seconds);
 $hash=hash_hmac('sha256',$bucket.'|'.$window.'|'.($identity?:($_SERVER['REMOTE_ADDR']??'unknown')),config()['app_key']);
 query('DELETE FROM rate_limits WHERE expires < ?',[$now]);
 try{query('INSERT INTO rate_limits (id,hits,expires) VALUES (?,0,?)',[$hash,($window+1)*$seconds]);}catch(PDOException $e){if(!in_array((string)$e->getCode(),['23000','19'],true))throw $e;}
 $q=query('UPDATE rate_limits SET hits=hits+1 WHERE id=? AND hits < ?',[$hash,$max]);if($q->rowCount()!==1)fail('rate',429);
}
function mail_ready(): bool {$c=config();return !empty($c['smtp']['host'])&&!empty($c['smtp']['from'])&&!empty($c['smtp']['user'])&&!empty($c['smtp']['password']);}
function send_mail(string $to,string $subject,string $body,?string $reply=null): void {
 foreach(['Exception','PHPMailer','SMTP'] as $class)require_once __DIR__.'/vendor/PHPMailer/'.$class.'.php';
 $s=config()['smtp'];$m=new PHPMailer\PHPMailer\PHPMailer(true);$m->isSMTP();$m->Host=$s['host'];$m->Port=(int)$s['port'];$m->SMTPAuth=true;$m->Username=$s['user'];$m->Password=$s['password'];$m->SMTPSecure=$s['encryption'];$m->CharSet='UTF-8';$m->Timeout=12;$m->SMTPDebug=0;
 $m->setFrom($s['from'],$s['from_name']??'ALMAZARA');$m->addAddress($to);if($reply)$m->addReplyTo($reply);$m->Subject=$subject;$m->Body=$body;$m->send();
}
function email_copy(string $l): array {
 return [
 'ES'=>['Confirma tu suscripción · ALMAZARA','Confirma que quieres recibir las novedades de ALMAZARA. Abre este enlace y pulsa Confirmar (caduca en 24 horas):','Si no lo has solicitado, ignora este correo. No recibirás la newsletter sin confirmar.','Cancelar la solicitud o darte de baja:','Confirmar','Suscripción confirmada. ¡Gracias!','Darme de baja','Tu suscripción se ha cancelado.','Este enlace ya no es válido.','Volver a ALMAZARA'],
 'DE'=>['Newsletter bestätigen · ALMAZARA','Bitte bestätige den ALMAZARA Newsletter über diesen Link (24 Stunden gültig):','Falls du dies nicht angefordert hast, ignoriere diese E-Mail. Ohne Bestätigung erhältst du keinen Newsletter.','Anfrage stornieren oder abmelden:','Bestätigen','Dein Abonnement ist bestätigt. Vielen Dank!','Abmelden','Du wurdest abgemeldet.','Dieser Link ist nicht mehr gültig.','Zurück zu ALMAZARA'],
 'FR'=>['Confirmez votre inscription · ALMAZARA','Confirmez les nouvelles ALMAZARA en ouvrant ce lien (valable 24 heures) :','Si vous ne l’avez pas demandé, ignorez cet e-mail. Aucun envoi sans confirmation.','Annuler la demande ou se désinscrire :','Confirmer','Inscription confirmée. Merci !','Se désinscrire','Votre inscription a été annulée.','Ce lien n’est plus valide.','Retour à ALMAZARA'],
 'IT'=>['Conferma l’iscrizione · ALMAZARA','Conferma le novità ALMAZARA aprendo questo link (valido 24 ore):','Se non hai richiesto l’iscrizione, ignora questa email. Nessuna newsletter senza conferma.','Annulla la richiesta o cancella l’iscrizione:','Conferma','Iscrizione confermata. Grazie!','Annulla iscrizione','Iscrizione annullata.','Questo link non è più valido.','Torna ad ALMAZARA'],
 'EN'=>['Confirm your subscription · ALMAZARA','Confirm ALMAZARA updates by opening this link and selecting Confirm (valid for 24 hours):','If you did not request this, ignore this email. No newsletter will be sent without confirmation.','Cancel this request or unsubscribe:','Confirm','Subscription confirmed. Thank you!','Unsubscribe','You have been unsubscribed.','This link is no longer valid.','Back to ALMAZARA']][$l];
}
