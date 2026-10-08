/** Página "Cuánto cuesta el SEO" (/servicios/precios/): fuente única para la página y su versión en Markdown */

export const pricingPage = {
  path: '/servicios/precios/',
  title: 'Cuánto cuesta el SEO',
  description:
    'Cuánto cuesta un consultor SEO y de qué depende: formatos, duración de cada proyecto, qué sube y qué baja el precio, y qué pedir a cualquier presupuesto.',
  lede: 'No publico una tarifa, porque una auditoría de una web de 500 páginas y la de una de 5 millones no se parecen en nada. Lo que sí puedo contarte es cómo trabajo, cuánto dura cada proyecto y qué hace que cueste más o menos. Al final tienes el formulario para pedirme un presupuesto cerrado.',
  formats: [
    {
      name: 'Auditoría SEO técnica',
      duration: 'Un mes',
      detail: 'Proyecto cerrado con precio cerrado: diagnóstico por page type, plan de acción priorizado y una sesión con tu equipo.',
      href: '/servicios/auditoria-seo/',
    },
    {
      name: 'Recuperar tráfico tras un core update',
      duration: 'Dos o tres semanas de diagnóstico',
      detail: 'Precio cerrado para encontrar la causa y el plan. El seguimiento hasta el siguiente core update, si lo quieres, va por meses.',
      href: '/servicios/recuperar-trafico/',
    },
    {
      name: 'Migraciones SEO',
      duration: 'Según el número de URLs',
      detail: 'Desde el inventario hasta el seguimiento posterior al lanzamiento. El precio depende sobre todo de cuántas URLs y plantillas cambian.',
      href: '/servicios/migraciones-seo/',
    },
    {
      name: 'SEO internacional',
      duration: 'Según idiomas y mercados',
      detail: 'Diagnóstico cerrado de estructura, hreflang y calidad por idioma, o acompañamiento mientras abres mercados.',
      href: '/servicios/seo-internacional/',
    },
    {
      name: 'Consultoría GEO',
      duration: 'Unas cuatro semanas de diagnóstico',
      detail: 'Medición de partida en ChatGPT, AI Mode y AI Overviews, análisis de fan-outs y plan. Después, medición y trabajo mensual.',
      href: '/servicios/consultoria-geo/',
    },
    {
      name: 'Consultoría SEO técnica mensual',
      duration: 'Por meses',
      detail: 'Dirijo las prioridades, reviso los cambios antes de publicarlos y mido los resultados. Casi siempre empieza con una auditoría.',
      href: '/servicios/consultoria-seo-tecnica/',
    },
  ],
  drivers: [
    {
      title: 'El tamaño de la web',
      detail: 'Más que el número de URLs, cuenta el número de page types: cada plantilla es un diagnóstico distinto.',
    },
    {
      title: 'De dónde partimos',
      detail: 'No es lo mismo revisar una web sana que buscar la causa de una caída o deshacer una migración que salió mal.',
    },
    {
      title: 'Idiomas y mercados',
      detail: 'Cada idioma o país añade demanda que investigar, hreflang que revisar y contenido cuya calidad hay que medir.',
    },
    {
      title: 'Quién ejecuta',
      detail: 'Si tu equipo aplica los cambios, yo dirijo y reviso. Si hay que coordinar a varios proveedores, hay más trabajo de mi parte.',
    },
    {
      title: 'El alcance mensual',
      detail: 'Marcar prioridades una vez al mes no es lo mismo que revisar cada cambio antes de que salga a producción.',
    },
    {
      title: 'La urgencia',
      detail: 'Una migración que sale en dos semanas obliga a concentrar el trabajo. Si se puede, mejor contar conmigo desde que se decide.',
    },
  ],
  checklist: [
    'Qué se entrega exactamente y en qué plazo, por escrito.',
    'Quién hace el trabajo: la persona con la que hablas o alguien a quien no conoces.',
    'Cómo se va a medir si ha funcionado, y en cuánto tiempo es razonable esperar resultados.',
    'Qué necesita de tu equipo para que el trabajo se aplique.',
  ],
  redFlags: [
    'Garantías de posiciones o de salir en ChatGPT. Nadie controla lo que hace Google ni lo que responde un modelo.',
    'Un número fijo de enlaces al mes como forma de medir el trabajo.',
    'Informes automáticos de una herramienta presentados como auditoría.',
    'Resultados prometidos en semanas después de un core update. Google habla de 3 a 6 meses de media.',
  ],
  faq: [
    {
      question: '¿Cuánto cuesta un consultor SEO?',
      answer:
        'Depende del tamaño de la web, del punto de partida y de cuánto se ejecuta juntos. Yo trabajo con proyectos cerrados (auditoría, migración, diagnóstico de una caída) y con acompañamiento mensual, siempre con precio cerrado y por escrito antes de empezar.',
    },
    {
      question: '¿Por qué no publicas tus precios?',
      answer:
        'Porque cualquier cifra sería engañosa: la misma auditoría puede durar días o semanas según la web. Prefiero entender tu caso en una llamada de 30 minutos y mandarte una propuesta cerrada.',
    },
    {
      question: '¿El presupuesto es cerrado?',
      answer:
        'Sí. Después de la primera llamada te mando por escrito el alcance, los plazos y el precio. Si algo cambia por el camino, lo hablamos antes de hacerlo.',
    },
    {
      question: '¿Con cuántos clientes trabajas a la vez?',
      answer: 'Con un máximo de 4 clientes de consultoría a la vez, para poder dedicar a cada uno el tiempo que necesita.',
    },
  ],
} as const;

export const pricingPageEn = {
  path: '/en/services/pricing/',
  title: 'How much SEO costs',
  description:
    'How much an SEO consultant costs and what it depends on: formats, how long each project lasts, what pushes the price up or down, and what to ask of any SEO quote.',
  lede: 'I do not publish a rate, because an audit of a 500-page site and one of a 5-million-page site have nothing in common. What I can tell you is how I work, how long each project lasts and what makes it cost more or less. At the end there is a form to ask me for a fixed quote.',
  formats: [
    {
      name: 'Technical SEO audit',
      duration: 'One month',
      detail: 'A fixed project with a fixed price: diagnosis by page type, a prioritized action plan and a session with your team.',
      href: '/en/services/seo-audit/',
    },
    {
      name: 'Recover traffic after a core update',
      duration: 'Two or three weeks of diagnosis',
      detail: 'Fixed price to find the cause and build the plan. Monitoring until the next core update, if you want it, is priced by month.',
      href: '/en/services/core-update-recovery/',
    },
    {
      name: 'SEO migrations',
      duration: 'Depends on the number of URLs',
      detail: 'From the inventory to the monitoring after launch. The price depends mostly on how many URLs and templates change.',
      href: '/en/services/seo-migrations/',
    },
    {
      name: 'International SEO',
      duration: 'Depends on languages and markets',
      detail: 'A fixed diagnosis of structure, hreflang and quality by language, or ongoing support while you open markets.',
      href: '/en/services/international-seo/',
    },
    {
      name: 'GEO consulting',
      duration: 'About four weeks of diagnosis',
      detail: 'Baseline measurement in ChatGPT, AI Mode and AI Overviews, fan-out analysis and a plan. After that, monthly measurement and work.',
      href: '/en/services/geo-consulting/',
    },
    {
      name: 'Monthly technical SEO consulting',
      duration: 'By the month',
      detail: 'I set the priorities, review changes before they ship and measure the results. It almost always starts with an audit.',
      href: '/en/services/seo-geo-consulting/',
    },
  ],
  drivers: [
    {
      title: 'The size of the site',
      detail: 'More than the number of URLs, what counts is the number of page types: each template is a different diagnosis.',
    },
    {
      title: 'Where we start from',
      detail: 'Reviewing a healthy site is not the same as finding the cause of a drop or undoing a migration that went wrong.',
    },
    {
      title: 'Languages and markets',
      detail: 'Each language or country adds demand to research, hreflang to review and content whose quality has to be measured.',
    },
    {
      title: 'Who executes',
      detail: 'If your team applies the changes, I lead and review. If several vendors need coordinating, there is more work on my side.',
    },
    {
      title: 'The monthly scope',
      detail: 'Setting priorities once a month is not the same as reviewing every change before it goes to production.',
    },
    {
      title: 'Urgency',
      detail: 'A migration that ships in two weeks forces the work to be compressed. If you can, bring me in as soon as it is decided.',
    },
  ],
  checklist: [
    'What exactly is delivered and by when, in writing.',
    'Who does the work: the person you talk to or someone you have never met.',
    'How success will be measured, and how long it is reasonable to wait for results.',
    'What it needs from your team for the work to get applied.',
  ],
  redFlags: [
    'Guarantees of rankings or of showing up in ChatGPT. Nobody controls what Google does or what a model answers.',
    'A fixed number of links a month as the way to measure the work.',
    'Automated tool reports presented as an audit.',
    'Results promised within weeks after a core update. Google talks about 3 to 6 months on average.',
  ],
  faq: [
    {
      question: 'How much does an SEO consultant cost?',
      answer:
        'It depends on the size of the site, the starting point and how much we execute together. I work with fixed projects (audit, migration, diagnosis of a drop) and with monthly advisory, always with a fixed price in writing before we start.',
    },
    {
      question: 'Why don\'t you publish your prices?',
      answer:
        'Because any number would be misleading: the same audit can take days or weeks depending on the site. I prefer to understand your case on a 30-minute call and send you a fixed proposal.',
    },
    {
      question: 'Is the quote fixed?',
      answer:
        'Yes. After the first call I send you the scope, timelines and price in writing. If something changes along the way, we talk about it before I do it.',
    },
    {
      question: 'How many clients do you work with at a time?',
      answer: 'At most 4 consulting clients at a time, so I can give each one the time they need.',
    },
  ],
} as const;

export const pricingPages = { es: pricingPage, en: pricingPageEn } as const;
