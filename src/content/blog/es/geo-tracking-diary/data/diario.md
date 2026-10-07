# Diario del posicionamiento GEO de nachomascort.com (borrador en bruto)

Notas para el post. No es texto publicable: datos, decisiones e incidencias en orden.

---

## Día 0 · 2026-10-06 · Punto de partida

### Keyword research (v1, se ampliará el 2026-10-07)
- Mercado: España, español. Keyword Planner (API interna) con idioma 1003 y ubicación 2724, sep 2025 a ago 2026.
- 38 semillas → autocomplete de Google (hl=es, gl=es) → 8 consultas al Planner → 408 ideas → filtro manual de intención → **149 keywords en 16 clusters** (14 trabajados, 2 de control).
- La cuenta de Ads no tiene gasto activo: el Planner solo da rangos (1K-10K, 100-1K, 10-100, 0-10).
- Detalle: `keywords.csv`, `clusters.md`. Mapeo al tracker: `tracker.json`.
- Hallazgos:
  - La demanda comercial grande está en "consultor seo" y "consultoria seo" (1K-10K). GEO en español es pequeño: "consultor geo" 10-100; "seo para ia" y "generative engine optimization" 100-1K.
  - Con las 10 semillas GEO, el Planner devolvió solo esas 10, sin ideas nuevas. Con "consultor seo", 135. Tema nuevo, poco histórico.
  - 11 ciudades españolas en 100-1K para "consultor seo [ciudad]".
  - "geo" a secas choca en el autocomplete con geología y geografía.

### Cómo se mide
- Geo-tracker propio (Cloudflare Worker + D1 + DataForSEO + Gemini para extraer marcas).
- 16 entidades, cada una con 2 queries (AI Overviews) y 3 prompts (AI Mode y ChatGPT; Gemini y GPT sin búsqueda una vez al mes).
- N = 7: una muestra al día por query o prompt y superficie, a una hora distinta cada día.
- Coste estimado del panel: 11,41 $/mes, unas 4.555 muestras al mes (tope del proyecto: 25 $).
- 2 entidades de control (SEO ecommerce, SEO WordPress): tienen demanda pero no las voy a trabajar. Si suben igual que las trabajadas, la subida no es mía.
- Alias de marca: Nacho Mascort, nachomascort.com, NachoSEO. Dominio: nachomascort.com.
- Arranque de la medición: 2026-10-06 (3 entidades a mano a las 18:03-18:04 UTC; las otras 13 con "Arrancar todas" a las 18:07). Línea base: 2026-10-05 → 2026-10-19 (dos semanas desde el lunes).

### Primera foto (día 6, provisional, 150 respuestas válidas de entidades trabajadas)
- **Te nombran: 1 de 150 respuestas (0,7 %).** Intervalo de confianza al 95 %: 0,1 % a 3,7 %.
- **Entidades con presencia (≥ 50 % de su panel): 0 de 14.**
- Citation rate (enlazan nachomascort.com): 0,7 % (la misma respuesta). Share of voice: 0,09 %.
- Control: 0 de 11 respuestas.
- Por entidad: 0 menciones en 13 de 14. La única: Growth / CMO fraccional, 1 de 6.
- 95 respuestas seguían pendientes de extracción al cerrar el día (ver incidencias): la foto puede cambiar un poco cuando entren.

**La única mención**
- ChatGPT, prompt "¿Qué consultores de growth marketing con experiencia en SEO recomiendas en España?".
- Puesto 8 de 8 marcas, en una tabla. Delante: Julio Domínguez, Rafa Villaplana, Jazztel, Abanca, Santalucía, Sesame HR, Jordi Cívico.
- Enlaza nachomascort.com (con utm_source=chatgpt.com).
- Me describe como "SEO + Growth + IA", interesante para proyectos grandes, y cita Softonic y CNET. Los dos salen en mi web (logos de clientes y caso de Softonic): ChatGPT está leyendo nachomascort.com.

**Quién sale en mi lugar (marcas más nombradas en todas las respuestas)**
Aleyda Solís (42), Orainti (32), ChatGPT (31), Natzir Turrado (26), Perplexity (24), Google (22), Gemini (21), BigSEO (20), Semrush (17), Webpositer (17), Shopify (16), WordPress (14), Fernando Maciá (11), Juan González Villa (11), MJ Cachón (11).
- En los prompts informativos ("¿qué es el SEO para IA…?") casi todo lo que sale son plataformas (Google, ChatGPT, Copilot, Bing, OpenAI), no consultores.
- Salen BigSEO y Webpositer (donde doy clase), pero como marcas propias, sin nombrarme a mí.

**Webs más citadas**
whitepress.com, natzir.com, davidviejo.com, aleydasolis.com, monicacabani.com, orainti.com, omibu.com, rafavillaplana.com, useo.es, malt.es, mecagoenlos.com, mjcachon.com.
- Directorios y marketplaces (malt.es, whitepress.com) aparecen junto a webs personales de consultores.

### Fan-outs con `site:`: los candidatos ya vienen decididos ("hardwired", Wil Reynolds)
Fuente: Wil Reynolds (Seer Interactive), [Re-imagining AI visibility KPIs in a query fan-out world](https://www.seerinteractive.com/insights/ai-visibility-kpis). Mirando los fan-outs, ve que la IA ya trae "hardwired" (de serie) las marcas, publicaciones y personas en las que confía antes de buscar, y lanza búsquedas `site:` contra ellas. Propone medir si te recomiendan, no solo si sales (la "anti-recomendación": salir en la respuesta para que te descarten), y seguir las menciones en las publicaciones y personas en las que el modelo ya confía.

ChatGPT no busca "consultores SEO" y elige entre lo que sale: primero decide los nombres (de memoria) y luego lanza búsquedas `site:` contra la web de cada candidato para verificar casos y trayectoria.

Ejemplo literal. Prompt: "Compara a los consultores SEO independientes más conocidos de España: experiencia, casos y en qué se especializa cada uno." (ChatGPT, entidad Consultor SEO, 2026-10-06 18:03 UTC, respuesta 16). Fan-outs, en orden:
1. consultores SEO España Fernando Maciá Luis Villanueva Dean Romero MJ Cachón casos clientes trayectoria
2. SEO España consultor Fernando Maciá Luis Villanueva MJ Cachón Sergio Simarro casos
3. site:fernandomacia.com SEO consultor casos clientes trayectoria
4. site:lu1s.com SEO consultor casos clientes trayectoria Luis Villanueva
5. site:mjcachon.com SEO consultora casos clientes trayectoria
6. site:sergiosimarro.com SEO consultor casos clientes trayectoria
7. Aleyda Solis SEO consultant Spain Orainti experience clients cases
8. site:aleydasolis.com consulting SEO cases clients experience
9. Natzir Turrado SEO consultor España experiencia casos
10. site:natzir.com SEO consultor casos experiencia
11. Fernando Maciá casos éxito SEO Human Level clientes
12. site:humanlevel.com casos éxito SEO Fernando Maciá
- Cita mjcachon.com/sobre-mi/ (3 citas en esa respuesta).
- La primera búsqueda ya lleva los nombres. Si no estás en esa lista inicial, nunca llega a mirar tu web: nachomascort.com no aparece en ninguna `site:` del día 0.
- El mismo patrón en otros prompts:
  - "¿Quiénes son los mejores consultores de SEO para IA…?": busca por nombre a Lino Uruñuela, Sico de Andrés, MJ Cachón, Luis M. Villanueva y Antonio Díaz.
  - "…webs multidioma con millones de visitas": `site:` a seocom.es, bigseo.com, useo.es y flat101.es.
  - "Head of Growth / CMO fraccional", "consultor SEO WordPress" y migraciones: `site:linkedin.com/in …`. LinkedIn es una de las fuentes donde busca personas.
  - "¿Cómo aparecer en ChatGPT?": `site:openai.com` y `site:developers.google.com/search`. Para lo informativo, va a la documentación oficial.
- Lectura para el post: para las consultas de "recomiéndame a alguien" no basta con posicionar páginas. Hay que estar en la memoria del modelo (menciones, listas, LinkedIn, medios) para entrar en la lista inicial, y que tu web aguante la verificación `site:` (casos, clientes, trayectoria).

### Incidencias del día (para contar el "detrás")
1. **Las pestañas del panel salían vacías.** El panel agrupaba por semana y ocultaba la semana en curso hasta cerrarla. Lo cambié: ahora todo se puede ver por día, semana o mes, y el periodo en curso se enseña como provisional (línea discontinua).
2. **El 41 % de las respuestas del primer día falló al extraer las marcas** (122 de 296): Gemini devolvió 429 (cuota) y 503 (saturado) al lanzar 13 entidades de golpe. Con más del 10 % de fallos el día se marca incompleto. Arreglo: la respuesta se guarda y solo se reintenta la extracción, con esperas crecientes; las 122 se re-extrajeron desde el bruto guardado sin volver a pagar las muestras.
3. Pendiente: si la clave de Gemini está en la capa gratuita, cada tanda diaria volverá a chocar con el límite.

### Otras decisiones
- Ranking diario: solo la primera muestra de cada semana lee el top 100 de Google; los demás días, el top 10. Para las posiciones 11-100 de un día se arrastra la última lectura profunda (marcada con *). Leer el top 100 a diario costaría unos 5 $/mes más.
- Fan-outs: ChatGPT los da en cada respuesta. "Investigar fan-outs" (Gemini con grounding) es aparte, bajo demanda, 0,045 $ por prompt.

---

## Día 1 · 2026-10-07 · Keyword research v2 y mapa de páginas

- Amplié el research a todo el mundo SEO: 23 temas, dos pasadas (amplitud y profundidad), 6.166 keywords útiles en 56 subtemas. Detalle: `kwr-v2.md`.
- Con eso monté el mapa de páginas (`mapa-paginas.html`, publicado también como artifact privado): 28 páginas a mantener o crear, de las que 4 existen, 7 hay que reorientar y 17 faltan; 4 bloques de demanda descartados.
- Prioridad alta, en orden: consultor SEO (reorientar la página actual), consultor GEO, auditoría SEO, recuperar tráfico tras un core update, SEO técnico y webs grandes, precio del SEO, guía GEO, AI Overviews y AI Mode, posicionar en ChatGPT, por qué mi web no aparece en Google, keyword research paso a paso, generador de llms.txt.
- Lección de proceso: con miles de keywords, la revisión de intención una a una no escala. La hice por reglas (taxonomía de 60 reglas en orden) revisando cada grupo y lo que quedaba sin clasificar; se colaron cosas como "webMASTER" en másteres o "reCURSOs" en cursos, y salieron al revisar.
- Lección técnica: el navegador no deja sacar los datos de Google Ads a un archivo local; se leen por partes como texto. La primera vez perdí la sesión al navegar fuera de la pestaña y tuve que repetir las dos pasadas.

### Arquitectura del sitio (propuesta, sin aplicar)
- Artifact privado con la propuesta (v2.2). Decisiones tras discutirla:
  - Seis servicios técnicos. Página de precios sin tarifa: modelos, qué mueve el precio, días de trabajo típicos y formulario.
  - Guías grandes (empezando por GEO) con capítulos de SEO invitados y ebook. HTML primero; el PDF es la misma obra.
  - Lo básico ("qué es llms.txt") en un glosario de una sola página, para no llenar el sitio de contenido commodity.
  - Patentes y documentos de Google como categorías del blog, no como sección. El diario GEO, como post.
  - "Investigación" pasa a "Estudios". Ninguna página de ciudad: las ciudades van en la home y en Sobre mí (una página "consultor SEO España" competiría con la home y olía a doorway).

### Revisión adversarial de la propuesta: ¿basta para salir en la IA?
- **No basta.** Lo que más pesa en las preguntas de "recomiéndame a alguien" pasa fuera de la web. El día 0, ChatGPT decidió los nombres antes de buscar y nachomascort.com no apareció en ninguna búsqueda `site:`. Ninguna página nueva cambia esa lista inicial; la cambian las menciones en otros sitios. El trabajo en la propia web hace tres cosas:
  1. Que la verificación `site: … casos clientes trayectoria` encuentre pruebas cuando ya estás en la lista (Sobre mí, casos).
  2. Que Google posicione las páginas que alimentan AI Overviews y AI Mode, donde sí se recupera desde el índice.
  3. Producir material que otros citen (estudios, guía con invitados, patentes). En realidad es una palanca externa disfrazada de contenido propio.
- **Lo informativo va a la fuente oficial.** En "¿cómo aparecer en ChatGPT?", los fan-outs fueron a `site:openai.com` y `site:developers.google.com/search`. Una guía GEO buena no garantiza citas en definiciones; su valor está en las menciones y los enlaces que gane.
- **La marca está repartida.** El schema de la web dice "Consultor de SEO, GEO e IA" y "Head of AI en Reverse Tech", y además está Gradual (agencia de IA). ChatGPT me describió como "SEO + Growth + IA". Si la propuesta es "consultor técnico", la web, LinkedIn y las bios de BigSEO y Webpositer tienen que decir lo mismo; si no, cada fuente cuenta una historia distinta (el KPI 5 de Wil Reynolds, la distancia entre lo que dicen de ti y el tema que quieres ganar).
- **La única mención vino de growth**, la parte que la propuesta saca del menú. Con 1 de 150 es ruido (IC 0,1-3,7 %), pero conviene no borrar growth de Sobre mí ni de LinkedIn mientras no haya datos.
- **"Consultor SEO" en la home es la apuesta más difícil**: unos 50.000 de demanda y una SERP llena de agencias y consultores con años de enlaces. Es un objetivo a meses vista; lo realista a corto es auditoría, core updates, AI Overviews y GEO, donde hay poca competencia en español.
- **Atribución.** Si se publica todo a la vez, el tracker no podrá decir qué movió qué. Reglas:
  - No publicar nada antes de cerrar la línea base (2026-10-19).
  - Publicar por tandas con fecha en este diario, cada tanda ligada a las entidades del tracker que debería mover.
  - Añadir al tracker entidades para lo nuevo que hoy no se mide (patentes de Google, cómo funciona AI Mode) antes de publicarlo, para tener su base.
- **Plazos distintos.** Lo que sale de la búsqueda en vivo (AI Overviews, AI Mode, ChatGPT con búsqueda) puede moverse en semanas. Lo que el modelo trae de memoria cambia cuando se reentrena, es decir, en meses.
- **Capacidad.** Seis servicios, guía con invitados, una patente al mes, un estudio mensual y herramientas es mucho para una persona que además trabaja. Si se hace con prisa, acaba siendo justo el contenido commodity que se quería evitar. Prioridad: lo que verifica (Sobre mí, casos, servicios) y lo que genera menciones (estudio de consultores, guía GEO).
- **El estudio "a quién recomienda la IA como consultor SEO"** tiene un conflicto de interés evidente si lo firma alguien que compite en ese ranking. Hay que publicar el método y los datos en bruto, y decir dónde salgo yo (o que me excluyo).
- **Comprobado y bien**: el robots.txt permite todos los bots de IA (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot…), las peticiones con esos user agents devuelven 200 y el schema Person tiene sameAs (LinkedIn, X, GitHub, Speaker Deck). Pendiente: comprobar la indexación en Bing (Webmaster Tools, IndexNow), porque la búsqueda de ChatGPT se apoya en parte en Bing.
- **Fase externa (después de la web)**: LinkedIn (sale en los fan-outs `site:linkedin.com/in`), entrar en las listas de "mejores consultores SEO de España" que el modelo usa para elegir nombres, perfiles en Malt (malt.es sale citado), que BigSEO y Webpositer me nombren como profesor, ponencias, podcasts y medios del sector, y que los autores invitados compartan la guía.

## Referencias para el post
- Wil Reynolds, Seer Interactive. Re-imagining AI visibility KPIs in a query fan-out world. https://www.seerinteractive.com/insights/ai-visibility-kpis (hardwired, anti-recomendación, KPIs de credibilidad).
- Dan Petrovic, DEJAN. Why we don't do prompt tracking. https://dejan.ai/blog/prompt-tracking (medir por entidades canónicas con una sonda fija y muchas muestras; es el método del geo-tracker).

