# Revisión de Almazara

Fecha: 23 de septiembre de 2026. Referencia: «Detalles a revisar.pdf» y proyecto facilitado por el cliente.

## Correcciones del documento

| Nº | Solicitud | Resultado aplicado |
|---|---|---|
| 1 | Mejorar el vídeo principal del jamón | Actualizado después de recibir VID-20260918-WA0052.mp4: se usa el clip del cliente de 24,3 segundos, con corrección de luz, color y nitidez y exportación web a 1920 × 1080. Sustituye al vídeo anterior de Inicio. El origen es 848 × 480; la resolución de salida está reescalada. Véase VIDEO_INICIO.md. |
| 2 | Descriptor en mayúsculas | «ACEITE DE OLIVA · JAMÓN IBÉRICO» se muestra en mayúsculas en Inicio, también al cambiar de idioma. |
| 3 | Tipografía correcta del logo | Abril Display Regular, archivo OTF aportado por el cliente, incorporada y servida desde assets/fonts. Aplicada al nombre de la marca en las ocho cabeceras. |
| 4 | Sustituir foto IA del aceite | Actualizado según la captura marcada del 24/09: cuatro fotografías verticales llenan la cabecera, con botellas, pan, jamón y escena junto al lago. Eliminada la fila superior de tres botellas y la columna vacía. Véase COLLAGE_INICIO.md. |
| 5 | Sustituir olivar IA | Fotografía de olivar ya incluida como aceites-hero-olivar-pexels.jpg. |
| 6 | Retocar foto del jamón | Ajuste visual suave de luminosidad, contraste, saturación y encuadre mediante CSS. El archivo original se conserva: no se ha reconstruido el fondo ni hecho un retoque de estudio. |
| 7 | Eliminar vídeos IA al final de Inicio | Retirado el reproductor y la secuencia de vídeos de ese bloque. Se muestra un paisaje estático del propio proyecto. |
| 8 | Quitar «Nuestras raíces / Nuestro mañana» | Eliminados texto y separador asociados. |
| 9 | Reformular «Desde Suiza acercamos…» | «Traemos a Suiza una selección de sabores españoles con un servicio cercano y personal». Actualizadas sus versiones DE, FR, IT y EN. |
| 10 | Simplificar y centrar la frase final de Nosotros | Eliminado «Nuestra tierra · Nuestro origen». Frase centrada, sin salto forzado, en una línea cuando hay espacio; se adapta al móvil. Se mantiene el paisaje. |
| 11 | Acortar el texto principal de Aceites | «Aceite de oliva virgen extra nacido entre tradición y tiempo». Actualizadas sus versiones DE, FR, IT y EN. |
| 12 | Cambiar imagen principal de Productos | Fotografía real del producto aportada en el ZIP, con encuadre adaptado a móvil y escritorio. |
| 13 | Retirar categorías no disponibles | Eliminados quesos, conservas y otros productos. Permanecen aceites, jamones y packs del catálogo existente. |
| 14 | Mejorar imágenes de Recetas | Seis fotografías reales de platos, optimizadas en WebP; reemplazo de la imagen destacada y del banner inferior. Atribuciones en la página y en CREDITOS_FOTOGRAFIAS.md. |

Las fotografías de recetas son ilustrativas: algunas guarniciones y presentaciones difieren de las instrucciones. Se indica junto a los créditos. Los recursos originales del ZIP se conservan, aunque algunos ya no se utilizan.

## Ajustes funcionales vinculados a la revisión

- Cabecera coherente entre las ocho páginas, con iconos de búsqueda y cesta.
- Corregido el conflicto que podía sustituir el título de Nosotros por el de Inicio al aplicar traducciones.
- Restauración de los textos revisados y del título de página al volver a español; navegación móvil traducida.
- Filtros de categoría y precio operativos, reinicio y mensaje de resultados vacíos.
- Resumen de pedido conectado al carrito, con cantidades, subtotal persistente y actualización al editar la cesta.
- Título, descriptor y botón de compra legibles en Inicio móvil durante la reproducción del vídeo.
- Corregidos saltos de línea literales erróneos en la hoja de estilos original.

## Comprobaciones

Pruebas en Chromium de las ocho páginas a 390, 834 y 1440 píxeles de ancho: sin desbordamiento horizontal ni imágenes rotas en las comprobaciones realizadas. Revisión adicional del botón principal a 320 píxeles.

Pruebas de cambios de idioma ES/DE/FR/IT/EN en los textos revisados; filtros; añadir y modificar cantidades; persistencia del subtotal al pasar al resumen de pedido; menú móvil; apertura y cierre de recetas; transición del vídeo a las fotos; carga efectiva de Abril Display Regular. No constituyen una certificación de todos los navegadores ni una revisión lingüística completa de todo el contenido previo.

## Uso del proyecto

1. Descomprimir AlmazaraWeb2026.zip.
2. Servir el contenido de AlmazaraWeb2026 con un servidor web estático. Para una revisión local con Python instalado: `python -m http.server 8000` desde esa carpeta y abrir `http://localhost:8000`.
3. Para actualizar el alojamiento existente, sustituir el proyecto completo, incluidas las carpetas assets/css, assets/js, assets/fonts e imágenes. Recargar el navegador si conserva archivos antiguos en caché.

Esta entrega modifica los archivos del proyecto; no publica cambios en el dominio. El pago online permanece en la fase preparatoria que traía el proyecto: no se ha contratado ni conectado una pasarela, ni definido tarifas de envío. Los servicios externos y formularios que ya eran demostrativos no se han convertido en servicios de producción.
