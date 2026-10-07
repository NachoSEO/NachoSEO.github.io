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
      duration: 'Unas dos semanas',
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
