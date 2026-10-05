**Veredicto del site:** Sólido con huecos. Las páginas comerciales y el post nuevo aguantan bien un core update porque se apoyan en casos y datos que solo tiene Nacho Mascort. El riesgo está en el archivo de SEO Hacks: 19 posts de 2015–2017, casi todos commodity o desfasados, que son el 44 % de las URLs en español del sitemap y el 90 % del blog.

Método: he aplicado la skill Google Quality Audit (cuatro pilares de 0 a 4, test de commodity, red flags de las Search Quality Rater Guidelines del 11 sept 2025 y señales del leak de mayo 2024) a una página por page type. Fuente: HTML generado en `dist/` (5 oct 2026, versión aún sin publicar), leído directamente y sin navegación ni formularios al juzgar el contenido principal. Para la herramienta he revisado el código de `functions/api/bot-check.ts` y he probado el endpoint en producción (`/api/bot-check`) con nytimes.com y nachomascort.com. Los tests de top 10 los he hecho con búsquedas web en EE. UU.; donde solo he visto títulos y snippets lo indico como "parcialmente comprobado". No tengo datos de tráfico ni de Search Console, así que las recomendaciones sobre el archivo no tienen en cuenta qué posts traen visitas.

### Resumen

| Page type | Página auditada | Puntuación | Clase commodity | Veredicto |
|---|---|---|---|---|
| Home | `/` | 11/16 | Non-commodity | Sólido con huecos |
| Servicios | `/servicios/consultoria-seo-geo/` | 10/16 | Parcialmente commodity | Sólido con huecos |
| Casos | `/casos/softonic-0-a-20-millones/` | 10/16 | Non-commodity | Sólido con huecos |
| Herramientas | `/herramientas/comprobador-bots/` | 11/16 | Parcialmente commodity | Sólido con huecos |
| Blog nuevo (2026) | `/blog/quality-google-core-updates/` | 13/16 | Non-commodity | Sólido |
| Archivo SEO Hacks (2015–2017) | `/blog/que-es-thin-content/` | 6/16 | Commodity | En riesgo |

---

### 1. Home

**Veredicto:** Sólido con huecos (11/16, non-commodity). La página vende con nombres y cifras propias, pero todas las pruebas acaban en afirmaciones sin evidencia externa y varias frases se repiten casi literales.

**Propósito:** presentar a Nacho Mascort como consultor de SEO, GEO e IA y llevar a una llamada o al formulario. YMYL: no (servicios B2B de marketing; no afecta a salud ni finanzas personales).

| Pilar | Puntuación | Evidencia | Arreglo |
|---|---|---|---|
| Effort | 3/4 | Contenido escrito a medida: cuatro servicios cada uno con un dato concreto ("pasó de 200 a más de 3.000 creatividades por semana", "contraté un equipo de 8 personas"), bloque de docencia con fechas (UPF 2015–2024, Webpositer desde 2018), muro de logos, curso con datos (450+ alumnos, 80+ vídeos). | Añadir una pieza que cueste replicar: un testimonio con nombre y cargo de un cliente o de un ex compañero de Softonic/Reverse Tech, o una captura real de un gráfico de tráfico. |
| Originality | 3/4 | Todo lo que aporta es propio: Softonic 0 → 20M sesiones, word.tips x2 con picos de 2M visitas/día, Reverse Tech 0 → 2 M$ de margen, ahorro de "unos 20.000 € al mes". Ningún competidor puede copiar estos datos. | Subiría a 4 con algo que otros citen: un dato publicado por primera vez aquí (p. ej. el porcentaje de páginas generadas que sobrevivieron a los core updates en Softonic). |
| Talent or skill | 3/4 | Estructura clara (quién soy, por qué yo, servicios, casos, docencia, curso, blog, contacto), CTA visibles, cifras arriba. Pegas: "Ex ingenieros de Google Search me contrataron" aparece en la meta description, en "Por qué yo", en el servicio SEO y otra vez en la bio de cada post; "Trabajas directamente conmigo, sin juniors ni subcontratas" sale dos veces. "Más de diez años enseñando" choca con "lleva más de 8 años dando clase en másters" en el mismo scroll. El bloque de blog solo muestra dos posts (2026 y 2023), lo que deja ver un hueco de tres años. | Decir lo de Google una vez y bien (en "Por qué yo"), unificar los años de docencia (desde 2015 son 11) y, mientras no haya más posts nuevos, mostrar en la home solo el de 2026 o un bloque de herramientas. |
| Accuracy | 2/4 | Cifras específicas y coherentes entre home, servicios y casos, pero ninguna lleva fuente verificable: los casos a los que enlaza tampoco tienen gráficos, capturas ni referencias externas. "Me han mencionado: Google Search Central" no enlaza a la mención. | Enlazar cada logo de "Me han mencionado" a la pieza concreta y poner en los casos una prueba por cifra principal (captura de Search Console o Analytics recortada, enlace a una charla o a LinkedIn de la empresa). |

**Commodity**
- Swap test: si cambias el nombre por el de otro consultor, la página pierde los casos, los logos, la docencia y el curso. Pasa.
- Top 10 test: no aplica a una home de marca personal (la query es navegacional, "Nacho Mascort").
- Activos only-you usados: casos con cifra, logos de clientes y medios, docencia, curso propio, herramientas propias.
- Ángulo non-commodity que falta: una cita de un cliente con nombre y resultado, o un gráfico real de uno de los casos en el propio bloque "Resultados con nombre y cifra".

**Red flags:** ninguna de las listas Lowest/Low. Sin anuncios ni popups (`clutterScore` sin motivo de preocupación). El campo "Company" del formulario es un honeypot oculto (`aria-hidden`), no afecta.

---

### 2. Servicios: Consultoría SEO, AEO y GEO

**Veredicto:** Sólido con huecos (10/16, parcialmente commodity). La prueba social es única, pero el proceso, los entregables y las FAQ son los que pondría cualquier consultor GEO.

**Propósito:** explicar el servicio de consultoría SEO/GEO, filtrar al cliente adecuado y llevar a una llamada. YMYL: no.

| Pilar | Puntuación | Evidencia | Arreglo |
|---|---|---|---|
| Effort | 3/4 | Criterios de encaje y de descarte reales ("Buscas SEO local para un único negocio. Ahí te irá mejor una agencia local"), opinión propia sobre IA y SEO, el ejemplo de Softonic (catálogo de 100.000 apps que cubría una parte pequeña de la demanda), límite de "máximo de 4 clientes", aviso honesto sobre llms.txt. | Añadir un ejemplo anonimizado de entregable (una página de una auditoría real, una fila de la hoja de ruta de 90 días). |
| Originality | 2/4 | Lo propio son los casos y el punto de vista. Las cuatro fases (diagnóstico, arreglos, contenido, medición), los cinco entregables y la FAQ "¿Qué diferencia hay entre SEO, AEO y GEO?" coinciden con lo que publican otros consultores GEO (p. ej. el artículo de Alejandro Rioja sobre qué hace un consultor GEO lista auditoría de entidad y datos estructurados, línea base de citas y lista priorizada). | Sustituir la FAQ genérica de SEO/AEO/GEO por algo que solo Nacho puede contar: cómo midió las citas en ChatGPT/Perplexity en Reverse Tech, qué cambió y con qué resultado. |
| Talent or skill | 3/4 | Muy bien ordenada: para quién es, punto de vista, cómo trabajamos con semanas, entregables, resultados, formatos, FAQ, siguiente paso en tres pasos. Responde rápido a "¿es para mí?". Pegas: "No es otro servicio con un nombre de moda: es el mismo trabajo bien hecho" es justo el eslogan que delata texto de plantilla; "No tengo tarifas cerradas" y, más abajo, "propuesta con… precio cerrado" se leen como contradicción aunque no lo sean. | Reescribir esa frase en llano ("Lo mido también fuera de Google") y aclarar: "No tengo tarifa fija; cada propuesta lleva un precio cerrado". Dar una horquilla orientativa de precio filtraría mejor. |
| Accuracy | 2/4 | Las definiciones y la nota sobre llms.txt son correctas. Las afirmaciones de negocio ("Las búsquedas informativas sencillas se las quedan los AI Overviews y los asistentes") van sin dato ni fuente, y las cifras de casos dependen de páginas que tampoco las prueban. | Apoyar la tesis con un dato (propio o de un estudio citado) y reforzar las pruebas de los casos (ver sección 3). |

**Commodity**
- Swap test: pierde Softonic, word.tips, Cliqpod/Reverse Tech y el límite de 4 clientes. El resto (fases, entregables, FAQ) se mantendría igual con otro nombre.
- Top 10 test: parcialmente comprobado. Para "consultoría SEO GEO consultor freelance" salen sobre todo perfiles de Malt y ofertas de empleo, y un artículo genérico sobre qué hace un consultor GEO. Ninguno trae casos con cifra, así que la página destaca por la prueba, no por el método.
- Activos only-you usados: casos con cifra, experiencia con equipos ex Google, opinión propia, límite de clientes.
- Ángulo non-commodity: "Qué cambió cuando medimos las citas de Reverse Tech en ChatGPT y Perplexity durante X meses", con la tabla de antes y después, como bloque central de la página.

**Red flags:** ninguna. Una frase de estilo plantilla (ver Talent) que no llega a ser filler (5.2.2).

---

### 3. Casos: Softonic, de 0 a 20 millones de sesiones al mes

**Veredicto:** Sólido con huecos (10/16, non-commodity). Es una historia que solo Nacho puede contar, incluido el fallo, pero es corta, sin gráficos y con el "cómo" contado en titulares.

**Propósito:** demostrar con un caso real la capacidad de diseñar un programa de contenido a gran escala y llevar a contacto. YMYL: no.

| Pilar | Puntuación | Evidencia | Arreglo |
|---|---|---|---|
| Effort | 3/4 | Contexto con fechas y cargos (2019–2024, SEO Specialist → Product Owner → SEO Manager), problema, cinco palancas, una sección "Lo que salió mal" con la caída de "un 20 y pico por ciento" tras consolidar idiomas y la recuperación al mover a ccTLDs. | Añadir la cronología con fechas (cuándo la consolidación, qué core update, cuándo la recuperación) y un gráfico de sesiones aunque sea sin eje Y. |
| Originality | 3/4 | Experiencia de primera mano que nadie más puede publicar, con un aprendizaje no obvio (las traducciones flojas bajaban la nota del dominio principal). | Contar el dato que lo haría citable: qué porcentaje de las páginas generadas se indexó, cuántas se retiraron y con qué criterio. |
| Talent or skill | 2/4 | 722 palabras. La única imagen es el logo de Softonic. "Cómo lo hicimos" se queda en titulares: "entrenamos nuestros propios modelos de generación" o "cada lote pasaba por flujos de generación y revisión" no dicen qué modelos, qué revisión ni cuántas personas. "Páginas útiles" no está definido. | Ampliar el "cómo" con una página de ejemplo (antes/después), el flujo de revisión en un diagrama y qué métrica decidía si un lote seguía. |
| Accuracy | 2/4 | Las cifras son concretas (0 → 20M, 100k → 1M+, +40 % en 2024) pero no llevan ninguna prueba ni fuente; "un 20 y pico por ciento" es vago; no se nombra el core update. | Una captura recortada por cifra principal, nombrar el core update y poner el porcentaje exacto de la caída. |

**Commodity**
- Swap test: pasa. Sin Nacho la página no existe.
- Top 10 test: no aplica (caso propio).
- Activos only-you usados: experiencia en Softonic, cifras internas, la historia de los idiomas.
- Ángulo non-commodity pendiente: ya lo es; lo que falta es evidencia y detalle de proceso.

**Red flags:** ninguna. Un matiz de contexto: el caso describe contenido generado con IA a escala (100.000 → 1M+ páginas). Contado así de breve, un lector desconfiado puede leerlo como lo que la sección 4.6.5 llama scaled content. Explicar con detalle el control de calidad y el criterio de demanda lo protege. [Criterio propio]

---

### 4. Herramientas: Comprobador de acceso de bots

**Veredicto:** Sólido con huecos (11/16, parcialmente commodity). La herramienta funciona y la guía es precisa, pero ya existen comprobadores casi iguales.

**Propósito:** comprobar si Googlebot, Bingbot y los bots de IA pueden rastrear una URL, y explicar por qué no. YMYL: no.

| Pilar | Puntuación | Evidencia | Arreglo |
|---|---|---|---|
| Effort | 3/4 | Herramienta propia (Cloudflare Pages Function de 488 líneas): 15 bots con petición real más 2 tokens solo de robots.txt, matching de robots.txt con la regla más larga y comodines, comparación con un navegador, detección de retos (Cloudflare, Akamai, DataDome…), noindex en meta y X-Robots-Tag con prefijo de bot, sitemaps, respuesta "thin" y protección SSRF. Probada en producción: en nytimes.com detecta el 403 de DataDome y las reglas `Disallow: /` de cada bot de IA; en nachomascort.com, todo "ok" y el sitemap válido. | Guardar (con permiso y anonimizado) resultados agregados para publicar datos propios. |
| Originality | 2/4 | Hay herramientas casi iguales. La de 365i (AI Crawler Checker) hace peticiones reales con 14 bots, compara con el navegador, mira noindex y avisa del límite de verificación por IP; Lightsite hace peticiones con 8 bots y detecta WAF; LLM Pulse solo analiza el robots.txt. Lo propio aquí: en español, cualquier URL (no solo la home), matching de Google, sitemap y detección de respuesta recortada. | Publicar un estudio con la herramienta: "Qué bots de IA bloquean las 500 webs más visitadas de España", con la tabla. Eso nadie lo tiene. |
| Talent or skill | 3/4 | Guía útil y bien escrita (cuatro causas, taxonomía búsqueda/usuario/entrenamiento, límites honestos, FAQ con la ruta exacta del panel de Cloudflare). La herramienta marca el Googlebot falso bloqueado como "warning" y no como "bloqueado", que es la lectura correcta. | Enlazar desde cada resultado "warning" al apartado de la guía que lo explica. |
| Accuracy | 3/4 | El comportamiento ante un robots.txt 5xx (12 horas, última copia hasta 30 días, después sin restricciones si la web responde) coincide con la documentación de Google y la enlaza. La taxonomía de bots de OpenAI, Anthropic y Perplexity es correcta, igual que lo de Google-Extended. Un detalle en el código: el grupo se elige con `token.startsWith(agent)`, así que una línea `User-agent: Claude` se aplicaría a ClaudeBot y a Claude-SearchBot, cuando RFC 9309 pide coincidencia exacta del token. [Criterio propio] | Cambiar a coincidencia exacta (sin distinguir mayúsculas) y, si se quiere imitar el fallback de Google para sus propios crawlers, tratarlo como caso aparte. |

**Commodity**
- Swap test: si pones otra marca, el usuario hispanohablante pierde la guía en español y algunos chequeos (sitemap, matching de Google); el núcleo lo encontraría en 365i.
- Top 10 test: comprobado abriendo tres resultados de "comprobar si bots de IA GPTBot ClaudeBot pueden acceder" (LLM Pulse, Lightsite, 365i). La guía y la herramienta van un poco por encima en detalle técnico, pero la función es la misma.
- Activos only-you usados: herramienta propia, experiencia con Cloudflare y robots.txt.
- Ángulo non-commodity: el estudio de bloqueos de bots de IA en webs españolas hecho con la propia herramienta, actualizado cada trimestre.

**Red flags:** ninguna.

---

### 5. Blog nuevo (2026): Quality en Google

**Veredicto:** Sólido (13/16, non-commodity). Crónica de primera mano del Search Central Live de Barcelona, con fotos propias, un caso real y fuentes en cada afirmación delicada.

**Propósito:** explicar qué es quality para Google, cómo se aplica y cuánto tarda una recuperación tras un core update. YMYL: no.

| Pilar | Puntuación | Evidencia | Arreglo |
|---|---|---|---|
| Effort | 4/4 | 5.000 palabras, 17 imágenes (fotos de slides del propio autor y de Estela Franco, con crédito), tabla de tiempos de recuperación, caso Softonic, 30 referencias con fecha (rater guidelines, docs de Google, notas del juicio DOJ, patentes, leak), lead magnet con skill propia. | Ya está en el máximo. |
| Originality | 3/4 | Lo propio: presencia en la sala, fotos de slides, tiempos "never (quality)" para sitemaps, indexing y datos estructurados, la historia de los idiomas de Softonic y su lectura sobre quality en AI Overviews. Lo que no es propio: el repaso del leak y de Q* ya lo han hecho Mike King, SparkToro o SEJ, y hay recaps del evento (We Are ROAST, Marie Haynes). | Publicar el dato propio que lo haga fuente: resultados de pasar la skill por varias webs grandes (anonimizadas), con qué page types salen peor. |
| Talent or skill | 3/4 | TL;DR, índice, H2 en forma de pregunta, tablas, separa con claridad lo documentado de "mi lectura". Pegas: el bloque de la skill aparece dos veces en el cuerpo; mucho término en inglés sin traducir ("quality", "page type", "effort"); la longitud pide más resúmenes intermedios. | Dejar un solo bloque de la skill (al final) y añadir una línea de resumen al inicio de las secciones largas. |
| Accuracy | 3/4 | Citas literales verificables, etiqueta lo que es deducción ("Que ese campo sea la versión algorítmica del pilar de effort es una deducción mía"), avisa de que los datos de "naranja" solo los vio en el slide. Detalles: la cabecera dice "3 de octubre de 2026" pero el texto cuenta algo hecho "el 4 de octubre de 2026" y no hay fecha de actualización ni `dateModified`; "El llms.txt, Google lo ignora" es más rotundo que la guía citada ("You don't need to create… AI text files"). | Mostrar "Actualizado el…" y añadir `dateModified`; matizar a "Google dice que no hace falta y no consta que lo use". |

**Commodity**
- Swap test: pasa. Sin la asistencia al evento, las fotos y el caso Softonic, quedaría un resumen más del leak.
- Top 10 test: parcialmente comprobado. Para la query de recuperación tras core update salen guías genéricas (Surfer, W3era, Wordtracker) sin datos del evento; ninguna tiene la tabla de tiempos de Google ni el "never (quality)".
- Activos only-you usados: fotos propias, crónica del evento, caso Softonic, skill propia.
- Ángulo non-commodity para subir a 4: el dataset de auditorías propuesto arriba.

**Red flags:** ninguna. El doble bloque del lead magnet es un poco de ruido, sin llegar al nivel de clutter que penaliza `clutterScore`.

---

### 6. Archivo SEO Hacks (2015–2017)

#### Página auditada: ¿Qué considera Google que es el "Thin Content" en realidad?

**Veredicto:** En riesgo (6/16, commodity). Post de 2015 con la misma lista de tipos de thin content que ya dan Google y el top 10, tono de la época y una nota de 2026 que corrige el único error grave.

**Propósito:** explicar qué entiende Google por thin content y qué hacer con páginas pobres. YMYL: no.

| Pilar | Puntuación | Evidencia | Arreglo |
|---|---|---|---|
| Effort | 2/4 | Escrito por una persona, con un consejo práctico propio ("crear una página en la que englobar todas las noticias") y una nota de octubre 2026 sustancial sobre robots.txt frente a noindex. Sin datos, ejemplos ni imágenes propias. | Si se mantiene, añadir un ejemplo real (antes/después de consolidar noticias cortas). |
| Originality | 1/4 | Los cuatro tipos (auto-generado, feeds de afiliación, duplicado, doorway) son la lista de la acción manual "Thin content with little or no added value" de Google y los mismos que trae SE Ranking en su artículo para "qué es thin content Google". | Ninguno barato: lo original ya está en el post nuevo de quality. |
| Talent or skill | 1/4 | Legible pero con el registro de 2015: "¡NO PENALIZA!", "Pandazo", "TIER 2 o incluso los TIER 3", "recuerda hacerlo en una web que no sea tu Money Site", "Un término del que se ha empezado a hablar recientemente" (de 2015), "manual de webmasters" sin enlace. No responde al buscador de hoy, que espera la relación con Panda, el sistema de contenido útil y los core updates. | Consolidar (ver más abajo). |
| Accuracy | 2/4 | Tras la nota, lo esencial es correcto (contenido corto no penaliza; duplicado técnico se resuelve con canonical). Siguen desfasados el enfoque de doorway como novedad y la ausencia de cualquier referencia al estado actual (helpful content integrado en el core en 2024). [Criterio propio] | Si se queda, nota final con el enlace al post de quality. |

**Commodity**
- Swap test: falla. Con otro nombre, el lector no pierde nada.
- Top 10 test: comprobado con "qué es thin content Google" (IEBS, Cyberclick, SE Ranking, Semrush, Rank Math, SEOcrawl). Todos dan la misma definición y la misma tipología.
- Activos only-you usados: ninguno, salvo el consejo de agrupar noticias.
- Ángulo non-commodity: "Cómo decidimos en Softonic qué páginas generadas retirar", con el criterio de demanda y los datos de indexación. Encaja mejor como sección del post de quality o del caso Softonic que como post aparte.

**Red flags:** ninguna Lowest. Encaja en la descripción de 5.2.1 (poco esfuerzo y poco valor añadido frente a lo que ya existe). La fecha "Actualizado el 5 de octubre de 2026" está justificada aquí por la nota, pero ver la observación sobre fechas en el resto del archivo.

#### Vista del resto del archivo (19 posts, `category: seohacks`)

He repasado título, apertura y notas de los 19 posts en `src/content/blog/es/`:

- **18 de 19 tienen una nota de 2026 o una sección "Qué sigue vigente en 2026".** Son correcciones reales y bien hechas (UA → GA4, noindex en robots.txt desde 2019, LSI, Penguin 4.0, SSL Flexible, etc.).
- **`relacion-semantica-inversa` no tiene ninguna nota** y su `updatedDate` sigue en 2016. Es una hipótesis sin datos ("lanzando una hipótesis basada en la observación") que se publica sin matiz.
- **Varios posts enseñan técnicas contra las políticas de spam** aunque ahora lleven aviso: `cloaking` (caso práctico de hacking + parasite SEO + cloaking), `analizando-tecnica-seo-piel-de-cordero` ("Analizando la técnica Black Hat"), `link-building-alex-navarro` (pirámides con PBN, "Tener una PBN en un segundo nivel te asegura que si la competencia te hace un spam report…"), `imagenes-originales` (el título promete "hacer creer a Google que tus imágenes son originales (cuando no lo son)") y `el-dia-a-dia-de-un-seo-en-gifs` (PBN). En la web de alguien que vende auditorías de calidad, esto contradice el mensaje.
- **Tono y formato de 2015** en casi todos ("¡Hola, querido lector!", "¡Entra Ya!" en la meta description de `https-gratis`) y sin imágenes en 15 de 19 por la recuperación del Internet Archive.
- **Todos llevan `updatedDate: 2026-10-05`** y `dateModified` igual. Las notas son cambios reales, pero 18 posts actualizados el mismo día con una nota corta encima de un cuerpo de 2015 se parece a lo que Google desaconseja (cambiar la fecha sin cambio sustancial). [Criterio propio]
- Lo aprovechable: `ddos` (experiencia propia, 120.000 visitas perdidas), `crawl-budget-optimizar-http-304` (técnico y todavía útil), `seo-tips-gary-illyes` (recopilación con algo de valor histórico) y los dos posts de Quality Raters/E-A-T, cuyo tema ya cubre mejor el post nuevo.

**Veredicto del page type:** En riesgo. Ninguno es spam, pero en conjunto es contenido commodity o desfasado con una minoría de piezas propias.

---

### Vista de page type y de site

Recuento con `dist/sitemap-0.xml`: 66 URLs indexables (43 en español, 23 en inglés).

| Page type | URLs (ES + EN) | Encaje con el foco | Recomendación |
|---|---|---|---|
| Home | 1 + 1 | Total | Mejorar (pruebas verificables, menos repetición) |
| Servicios | 4 + 4 (+ hubs) | Total | Mejorar (ángulo propio en proceso y FAQ, precio orientativo) |
| Casos | 4 + 4 (+ hubs) | Total | Mejorar (gráficos, fechas, detalle del "cómo") |
| Herramientas | 2 + 2 (+ hubs) | Alto | Mejorar (publicar datos propios con la herramienta) |
| Skills | 1 + 1 (+ hubs) | Alto | Mantener |
| Blog nuevo | 2 + 2 | Alto | Mantener y publicar más (solo hay un post de 2026 y otro de 2023) |
| Archivo SEO Hacks | 19 + 0 (+ hub) | Medio: es SEO, pero tácticas de 2015 y black hat | Consolidar, noindex o eliminar la mayoría |
| Legales y contacto | 3 + 3 | Neutro | Mantener |

Lo que pesa en el site:

- **Proporción.** El archivo son 19 de las 43 URLs en español (44 %) y 19 de los 21 posts del blog en español. Para Google, la mayor parte del "contenido editorial" de la web es SEO Hacks. El propio post de quality lo dice: las páginas flojas arrastran a las buenas.
- **Foco.** El tema (SEO) es el mismo, así que `siteFocusScore` no debería sufrir mucho. Lo que se aleja del núcleo actual (consultoría de SEO, GEO e IA para webs grandes) son los tutoriales de WordPress, HTTPS con Cloudflare, GIFs y las tácticas black hat. [Inferencia]
- **Coherencia de marca.** Las piezas de cloaking, PBN e imágenes "originales cuando no lo son" van contra el mensaje de calidad que vende el site.
- **Inglés.** Las versiones EN de home, servicios, casos, herramientas y los dos posts nuevos están enlazadas con hreflang. El archivo no tiene versión EN, así que la parte inglesa del site está más limpia que la española.

Recomendación para el archivo (sin datos de tráfico; si algún post trae visitas o enlaces, revisarlo antes):

| Acción | Posts |
|---|---|
| Mejorar y mantener | `ddos`, `crawl-budget-optimizar-http-304` |
| Consolidar con 301 al post de quality | `guia-quality-raters-google`, `credibilidad-vs-autoridad-eat`, `que-es-thin-content` |
| Noindex (se quedan como archivo para quien llegue por enlace) | `seo-tips-gary-illyes`, `guia-seo`, `200-factores-seo-que-posicionan-en-google`, `analisis-pagina-web-seo-on-page`, `accesibilidad-web-seo-parte-1`, `contenido-latent-semantic-index`, `creando-blog-seo-wordpress`, `https-gratis`, `el-dia-a-dia-de-un-seo-en-gifs` |
| Noindex o eliminar (black hat o hipótesis sin base) | `cloaking`, `analizando-tecnica-seo-piel-de-cordero`, `link-building-alex-navarro`, `imagenes-originales`, `relacion-semantica-inversa` |

Si se prefiere no tocar la indexación, la alternativa mínima es sacar el archivo del sitemap y dejar las fechas de actualización solo donde la nota cambia el sentido del post.

---

### Señales de Google relacionadas

| Hallazgo | Señal | Evidencia |
|---|---|---|
| Archivo con poco esfuerzo propio frente al post nuevo, con mucho | `contentEffort` | Descripción "LLM-based effort estimation for article pages" [Documentado]; que mida lo mismo que el pilar Effort [Inferencia] |
| El 44 % de las URLs en español son posts commodity de 2015–2017 | `chardEncoded`, `tofu` (site) | "site quality predictor based on content" [Documentado]; que el archivo baje esa nota [Inferencia] |
| Posts del archivo muy por debajo del nivel del resto del site | `rhubarb` | "Site-URL delta signals based quality score" [Documentado]; aplicación a este caso [Inferencia] |
| Tutoriales de WordPress/HTTPS, GIFs y black hat lejos del núcleo actual | `siteFocusScore`, `siteRadius` | Descripciones [Documentado]; que estos posts aumenten el radio [Inferencia] |
| Web personal de un consultor | `smallPersonalSite` | "Score of small personal site promotion" [Documentado]; si aplica a este site [Hipótesis] |
| Sin anuncios ni popups; un lead magnet repetido en el post nuevo | `clutterScore` | Descripción [Documentado]; riesgo bajo aquí [Criterio propio] |
| Posts de archivo con poca demanda y valor podrían quedar en tiers bajos o sin indexar | `scaledSelectionTierRank` | Score sobre tiers Base, Zeppelins, Landfills [Documentado]; Base mejor y Landfills peor [Inferencia] |
| Quality calculada por página pero con señales de site | Q* (juicio DOJ, notas de HJ Kim) | "generally static across multiple queries" [Documentado] |

---

### Acciones prioritarias

1. **Reducir el peso del archivo antes de publicar.** Aplicar la tabla de arriba: 301 de los tres posts que cubre el de quality, noindex o eliminación de los cinco black hat o sin base, y noindex del resto salvo `ddos` y `crawl-budget`. Como mínimo, sacarlos del sitemap y añadir nota a `relacion-semantica-inversa`.
2. **Revisar las fechas del archivo.** Dejar `updatedDate` solo donde la nota cambia de verdad el consejo; en el resto, mostrar "Nota añadida en 2026" sin tocar `dateModified`.
3. **Poner pruebas en los casos.** Un gráfico o captura por cifra principal, fechas y el nombre del core update en Softonic, y un "cómo" con ejemplos. Esto sube la accuracy de home, servicios y casos a la vez.
4. **Dar un ángulo propio al servicio de consultoría.** Cambiar la FAQ genérica de SEO/AEO/GEO por un caso de medición de citas en IA, aclarar lo del precio cerrado y quitar la frase "No es otro servicio con un nombre de moda: es el mismo trabajo bien hecho".
5. **Convertir la herramienta en fuente.** Publicar un estudio con ella (bloqueos de bots de IA en webs españolas) y corregir el matching de `startsWith` a coincidencia exacta del token.
6. **Pulir el post de quality.** Un solo bloque de la skill, `dateModified` y "Actualizado el…" coherentes con la mención del 4 de octubre, y matizar lo del llms.txt.
7. **Home.** Unificar los años de docencia, decir lo de los ex ingenieros de Google una sola vez y enlazar las menciones en medios.
8. **Ritmo editorial.** Con un solo post de 2026, el blog depende del archivo. Dos o tres piezas non-commodity más (dataset de auditorías, estudio de bots, caso de GEO medido) cambiarían la proporción del site.
