# ALMAZARA · Preparación para Hostinger

Esta versión incluye diseño responsive, vídeo de entrada, carrito, fichas, formularios PHP y pago preparado con Stripe Checkout. No se ha publicado ni se han enviado correos o realizado cobros reales.

**La web visual está preparada. La venta real requiere completar la configuración y una prueba en el alojamiento.** No basta con subir el ZIP para activar correo y pagos.

## 1. Subir la web

1. En la cuenta de Hostinger de Almazara, conecta el dominio y activa el certificado SSL y la redirección a HTTPS.
2. Usa alojamiento PHP (8.3 o superior), con cURL, OpenSSL, mbstring y PDO MySQL. Este proyecto no necesita WordPress para funcionar.
3. Sube el contenido de `AlmazaraWeb2026` a `public_html`: los HTML, `assets`, `api` y `.htaccess`. `index.html` debe quedar directamente en `public_html`, no dentro de una segunda carpeta.
4. Los archivos de notas y la carpeta `hostinger` son documentación. Puedes conservarlos fuera de `public_html`; no contienen claves reales. Las reglas incluidas impiden el acceso web a los ejemplos y dependencias privadas.
5. Crea una base de datos MySQL y su usuario en Hostinger. Las tablas `orders`, `newsletter`, `webhook_events` y `rate_limits` se crean en la primera petición que utiliza la base. El usuario de la base debe poder crearlas.
6. Crea **fuera de `public_html`**, a su mismo nivel, una carpeta `almazara-private`. Copia `hostinger/config.example.php` dentro y renómbralo a `config.php`.
7. Completa `base_url`, `app_key` aleatoria y credenciales MySQL. El backend busca `../almazara-private/config.php`. Protege la carpeta con permisos 700 y el archivo con 600 cuando el alojamiento lo permita. No coloques claves en JavaScript ni las envíes por chat.

Estructura final: `public_html/index.html`, `public_html/api/index.php` y, fuera del directorio público, `almazara-private/config.php`.

## 2. Correo y newsletter

- Configura una cuenta de correo del dominio con sus datos SMTP. El ejemplo usa Hostinger (`smtp.hostinger.com`, puerto 465, SSL); verifica los datos de la cuenta contratada. Cambia remitente, usuario y contraseña.
- Publica los registros de correo que indique el proveedor (SPF/DKIM) y comprueba recepción también en Gmail/Outlook.
- Activa `newsletter_enabled` y `contact_enabled` únicamente al tener la cuenta lista.
- La newsletter guarda el email y el consentimiento como **pendientes**; envía un enlace que caduca a las 24 horas. El usuario abre el enlace y pulsa Confirmar. Solo entonces queda suscrito. Los escáneres de enlaces no suscriben ni dan de baja con una simple visita.
- El enlace de baja también requiere una confirmación. No se envía ninguna campaña automáticamente. Para preparar campañas, exporta solo suscriptores confirmados, por CLI:

```sh
php hostinger/export-newsletter.php > ../almazara-private/suscriptores.csv
```

- El CSV incluye el enlace individual de baja: debe figurar en cada envío. Antes de cada campaña, vuelve a exportar la lista para respetar las bajas. Guarda el CSV fuera de la web pública. Para envíos masivos utiliza un servicio de campañas adecuado; el formulario de alta no es una plataforma de campañas.
- El contacto envía los mensajes al `contact_to` configurado y coloca al visitante en Reply-To. Los errores no simulan una suscripción o envío correcto.
- Define y aplica con la dueña los plazos de conservación de formularios, suscriptores, pedidos y copias de seguridad. Elimina solicitudes pendientes antiguas mediante un proceso acordado.

## 3. Activar el pago, primero en pruebas

La implementación prepara una **compra única con tarjeta en Stripe Checkout**, en CHF y con dirección de entrega en Suiza. No se han prometido PayPal, TWINT, transferencias ni facturación automática. La disponibilidad de otros medios y sus comisiones depende de la cuenta y de una configuración adicional.

1. La cuenta de Stripe debe pertenecer a Almazara. Completa su activación e información bancaria allí.
2. Introduce una clave secreta de prueba `sk_test_...` en la configuración privada.
3. En Stripe crea un endpoint de eventos **snapshot** apuntando a:
   `https://TU-DOMINIO/api/index.php?action=webhook`
4. Selecciona `checkout.session.completed`, `checkout.session.async_payment_succeeded` y `checkout.session.expired`. Usa la versión API `2024-06-20`, con la que se ha preparado el cliente, e introduce el secreto `whsec_...` del endpoint de ese entorno.
5. Confirma los precios, impuestos incluidos o aplicables, disponibilidad real, plazos de entrega y condiciones comerciales. Actualiza las páginas que todavía indican «Texto en revisión». Solo después establece `sale_terms_confirmed` en `true`.
6. Introduce `shipping_ch_cents`, en céntimos de CHF, **solo si la clienta confirma una tarifa plana para toda Suiza**. Ejemplo de formato: 800 significa CHF 8,00; NO es una tarifa propuesta ni acordada. Si el envío depende de peso, zona o cantidad, hay que definir esas reglas antes de cobrar esos pedidos.
7. El pack de 12 × 500 ml tiene envío incluido. Un pedido compuesto únicamente por ese pack aplica envío gratis. Si se mezcla con otros productos, aplica la tarifa confirmada. Los demás packs no tienen envío gratuito.
8. Los precios de jamón y paleta siguen siendo referencias anteriores **no confirmadas** (500 y 169 CHF). Se muestran como antes, pero su cobro está bloqueado. Confirma/corrige ambos en `assets/js/catalog.js` y `api/commerce.php`; revisa también los importes escritos en los HTML. Activa cada entrada de `prices_confirmed` solo al terminar.
9. Activa `payments_enabled` y prueba pago aprobado, cancelación, tarjeta rechazada, pérdida de conexión y llegada del webhook. Comprueba el pedido en Stripe y en `orders`.
10. Cuando todo esté comprobado, cambia a claves de producción y al secreto del endpoint de producción. No mezcles claves ni eventos de prueba y producción.

El servidor calcula precios y envío; el navegador no decide el importe. El webhook valida la firma, moneda, referencia e importe antes de marcar un pedido como pagado. Visitar la URL de agradecimiento no lo marca como pagado.

El pedido y la dirección de entrega se consultan en Stripe. La base local conserva la referencia y los importes, sin datos de tarjeta. Activa en Stripe los recibos al comprador y las notificaciones al negocio que necesite la clienta. La preparación y el envío de productos son manuales: no hay integración con transportistas, etiquetas, inventario automático ni panel de almacén.

## 4. Redes, vídeo y dispositivos

- Añade las URLs oficiales en `assets/js/site-config.js`. Los iconos de Instagram, Facebook y YouTube ya están dibujados; mientras no haya URL, permanecen sin enlace. Se ha retirado la cuenta personal que figuraba en el Instagram del negocio.
- La introducción ocupa toda la pantalla, sin franjas laterales en ordenador ni botones visibles. Reproduce el vídeo silenciado y da paso a la web al terminar, con un fundido suave. El archivo original conserva el audio, pero no se activa durante la introducción. En móviles muy altos se extiende el fondo para mantener el logo final dentro del encuadre.
- Se muestra una vez por sesión de pestaña. Recargar, volver desde otra página o usar Atrás no la repite. Una pestaña nueva inicia otra sesión; algunos navegadores restauran la sesión al reabrir pestañas cerradas.
- Si el navegador bloquea la reproducción o el vídeo falla, se entra directamente a la web. Escape permite omitir la introducción desde el teclado. Con «reducir movimiento» activo se entra directamente.
- En móvil y tablet, los reflejos se activan al entrar en pantalla y al tocar; al añadir un producto, el carrito salta. Se respeta la preferencia de reducir movimiento.
- Las cabeceras de aceites y productos muestran fotos completas. Una foto horizontal puede dejar espacio alrededor para preservar su composición.
- Abrir `index.html` con doble clic sirve para revisar el diseño. PHP, correo y pagos requieren un servidor; no funcionan desde una carpeta local abierta como `file://`.

## 5. Comprobación antes de publicar

- Probar desde un iPhone/Safari y un Android/Chrome reales, además de tablet y ordenador; revisar menú, idiomas, carrito, fichas y vídeo.
- Alta en newsletter → correo → confirmar → comprobar suscriptor → baja. Probar también formulario de contacto y fallo de SMTP.
- Pago de prueba → evento firmado → pedido pagado → recibo y aviso al negocio. Cancelación mantiene la cesta. Un enlace de éxito aislado nunca confirma un cobro.
- Verificar que `api/bootstrap.php`, `api/commerce.php`, `api/vendor/` y cualquier archivo de configuración no sean descargables; los datos privados deben quedar fuera de `public_html`.
- Hacer copia de archivos y base de datos y acordar con la clienta quién atiende pedidos, actualiza precios/stock y mantiene los servicios.

### Pruebas realizadas en esta entrega

Validación PHP 8.3; servidor local con SQLite; SMTP local simulado (sin correo externo); pasarela Stripe simulada (sin operaciones reales); firmas de webhook, importes, duplicados, CSRF, consentimiento y límites de peticiones. La ruta MySQL queda preparada para comprobar en Hostinger.

Navegación responsive en Chromium con emulación táctil y varios tamaños. Esto no sustituye una prueba en dispositivos físicos ni en el alojamiento contratado. No se ha validado aún la entrega real de correo, la conexión real a Stripe ni el despliegue.

Referencias técnicas: [Stripe Checkout](https://docs.stripe.com/api/checkout/sessions/create), [eventos y firmas](https://docs.stripe.com/webhooks), [PHPMailer](https://github.com/PHPMailer/PHPMailer). Se incluye PHPMailer 7.1.1 y su licencia.
