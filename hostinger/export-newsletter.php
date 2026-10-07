<?php
// CLI only: php hostinger/export-newsletter.php > ../almazara-private/suscriptores.csv
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/api/bootstrap.php';
$out=fopen('php://stdout','w');fputcsv($out,['email','idioma','confirmado_utc','url_baja']);
foreach(query("SELECT email,lang,confirmed FROM newsletter WHERE state='subscribed'") as $row){
 $token=hash_hmac('sha256','unsubscribe|'.$row['email'],config()['app_key']);
 $email=$row['email'];if(preg_match('/^[=+\-@]/',$email))$email="'".$email;
 fputcsv($out,[$email,$row['lang'],gmdate('c',(int)$row['confirmed']),base_url().'/api/index.php?action=unsubscribe&token='.$token]);
}
