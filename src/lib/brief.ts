/**
 * Briefing de presupuesto (/briefing/): servicios y preguntas. Lo usan el formulario
 * (src/components/BriefForm.astro) y la Pages Function que lo envía (functions/api/brief.ts),
 * así las etiquetas del email coinciden siempre con las del formulario.
 *
 * Los ids de servicio se usan en `?servicios=web,geo` y en las reglas CSS de BriefForm.astro:
 * si se añade un servicio, hay que añadir también sus reglas allí.
 */
export type ServiceId = 'web' | 'geo' | 'ia' | 'fraccional' | 'formacion';

export interface BriefService {
  id: ServiceId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface BriefOption {
  label: string;
  /** Placeholder de un campo de texto que aparece al marcar la opción (p. ej. "¿Cuál?") */
  detail?: string;
}

export interface BriefField {
  name: string;
  label: string;
  kind: 'text' | 'textarea' | 'single' | 'multi';
  options?: BriefOption[];
  hint?: string;
  placeholder?: string;
  /** Obligatorio (solo en campos que se muestran siempre: los ocultos no pasarían la validación nativa) */
  required?: boolean;
  /** Solo se muestra si está marcado alguno de estos servicios */
  showWith?: ServiceId[];
  /** Se oculta si está marcado este servicio */
  hideWith?: ServiceId;
}

export interface BriefSection {
  id: string;
  title: string;
  intro?: string;
  /** Sin servicio, la sección se muestra siempre */
  service?: ServiceId;
  fields: BriefField[];
}

export const briefServices: BriefService[] = [
  {
    id: 'web',
    label: 'Web nueva',
    shortLabel: 'Web',
    description: 'Diseño y desarrollo de tu web: rápida, fácil de gestionar y preparada para SEO.',
  },
  {
    id: 'geo',
    label: 'SEO y GEO',
    shortLabel: 'SEO/GEO',
    description: 'Que te encuentren en Google y te recomienden ChatGPT, Perplexity o Gemini.',
  },
  {
    id: 'ia',
    label: 'IA y automatización',
    shortLabel: 'IA',
    description: 'Procesos que hoy se hacen a mano, resueltos con IA y automatizaciones.',
  },
  {
    id: 'fraccional',
    label: 'Head of Growth fraccional',
    shortLabel: 'Fraccional',
    description: 'Dirección de growth unos días a la semana, sin contratar a tiempo completo.',
  },
  {
    id: 'formacion',
    label: 'Formación',
    shortLabel: 'Formación',
    description: 'Talleres y ponencias de SEO, GEO e IA para tu equipo o tu evento.',
  },
];

const OTHER: BriefOption = { label: 'Otro', detail: '¿Cuál?' };

export const briefSections: BriefSection[] = [
  {
    id: 'web',
    service: 'web',
    title: 'Tu web',
    fields: [
      {
        name: 'web_objetivo',
        label: '¿Qué tiene que conseguir la web?',
        kind: 'multi',
        options: [
          { label: 'Captar contactos y clientes' },
          { label: 'Vender online' },
          { label: 'Reservas o citas' },
          { label: 'Imagen y credibilidad' },
          OTHER,
        ],
      },
      {
        name: 'web_funcionalidades',
        label: '¿Qué tiene que poder hacer?',
        kind: 'multi',
        options: [
          { label: 'Formulario de contacto' },
          { label: 'Reservas o citas online' },
          { label: 'Tienda online', detail: 'Nº aproximado de productos' },
          { label: 'Varios idiomas', detail: '¿Cuáles?' },
          { label: 'Área privada para clientes' },
          { label: 'Blog o noticias' },
          OTHER,
        ],
      },
      {
        name: 'web_integraciones',
        label: '¿Con qué herramientas tiene que conectarse?',
        kind: 'multi',
        options: [
          { label: 'CRM', detail: '¿Cuál? (HubSpot, Pipedrive…)' },
          { label: 'Newsletter o email marketing', detail: '¿Cuál?' },
          { label: 'Pasarela de pago', detail: '¿Cuál?' },
          { label: 'Calendario o agenda' },
          { label: 'Analítica y píxeles de anuncios' },
          OTHER,
        ],
      },
      {
        name: 'web_edicion',
        label: '¿Vais a editar la web vosotros?',
        kind: 'single',
        options: [
          { label: 'Sí, a menudo' },
          { label: 'De vez en cuando' },
          { label: 'No, preferimos que la gestiones tú' },
        ],
      },
      {
        name: 'web_marca',
        label: '¿Tenéis identidad de marca?',
        kind: 'single',
        options: [
          { label: 'Logo y manual de marca' },
          { label: 'Solo logo' },
          { label: 'No, hay que crearla' },
        ],
      },
      {
        name: 'web_textos',
        label: '¿Quién escribe los textos?',
        kind: 'single',
        options: [{ label: 'Los aportamos nosotros' }, { label: 'Los redactas tú' }, { label: 'Una mezcla' }],
      },
      {
        name: 'web_fotos',
        label: '¿Y las fotos?',
        kind: 'single',
        options: [
          { label: 'Tenemos fotos propias' },
          { label: 'Banco de imágenes' },
          { label: 'Genéralas tú con IA' },
        ],
      },
      {
        name: 'web_actual_paginas',
        label: 'Si ya tienes web, ¿cuántas páginas tiene más o menos?',
        kind: 'single',
        options: [{ label: 'No tenemos web' }, { label: 'Menos de 20' }, { label: 'Entre 20 y 100' }, { label: 'Más de 100' }],
      },
      {
        name: 'web_actual_trafico',
        label: '¿Recibe visitas desde Google?',
        kind: 'single',
        options: [{ label: 'Sí, bastantes' }, { label: 'Pocas' }, { label: 'No lo sé' }],
      },
      {
        name: 'web_migracion',
        label: '¿Quieres que incluya la migración SEO?',
        hint: 'Redirecciones y revisión del cambio para no perder el tráfico que ya recibe tu web actual.',
        kind: 'single',
        options: [{ label: 'Sí, inclúyela' }, { label: 'No' }, { label: 'No tenemos web actual' }],
      },
    ],
  },
  {
    id: 'geo',
    service: 'geo',
    title: 'SEO y GEO',
    fields: [
      {
        name: 'geo_preguntas',
        label: '¿En qué búsquedas o preguntas te gustaría aparecer?',
        hint: 'Lo que tus clientes preguntarían a Google o a ChatGPT. Si no lo tienes claro, déjalo en blanco: te propongo yo las búsquedas.',
        placeholder: 'Ej.: «mejor gestoría para autónomos en Sevilla»',
        kind: 'textarea',
      },
      {
        name: 'geo_ambito',
        label: '¿Dónde están tus clientes?',
        kind: 'single',
        options: [
          { label: 'Local', detail: 'Ciudad o zona' },
          { label: 'En toda España' },
          { label: 'Internacional', detail: 'Países' },
        ],
      },
      {
        name: 'geo_idiomas',
        label: '¿En qué idiomas?',
        placeholder: 'Español, inglés…',
        kind: 'text',
      },
      {
        name: 'geo_objetivo',
        label: '¿Qué es lo más importante para ti?',
        kind: 'single',
        options: [
          { label: 'Conseguir más contactos y clientes' },
          { label: 'Que la marca sea más conocida' },
          { label: 'Superar a un competidor', detail: '¿Cuál?' },
        ],
      },
      {
        name: 'geo_expertos',
        label: '¿Hay alguien en el equipo que pueda revisar o firmar contenido como experto?',
        kind: 'single',
        options: [{ label: 'Sí', detail: 'Horas al mes que podría dedicar' }, { label: 'No' }],
      },
      {
        name: 'geo_cms',
        label: '¿Con qué está hecha tu web actual?',
        kind: 'single',
        hideWith: 'web',
        options: [
          { label: 'WordPress' },
          { label: 'Shopify' },
          { label: 'Wix o Squarespace' },
          { label: 'Desarrollo a medida' },
          { label: 'No lo sé' },
          OTHER,
        ],
      },
      {
        name: 'geo_cambios',
        label: '¿Quién puede hacer cambios técnicos en la web?',
        kind: 'single',
        hideWith: 'web',
        options: [{ label: 'Alguien del equipo' }, { label: 'Una agencia o freelance' }, { label: 'Nadie ahora mismo' }],
      },
    ],
  },
  {
    id: 'ia',
    service: 'ia',
    title: 'IA y automatización',
    fields: [
      {
        name: 'ia_procesos',
        label: '¿Qué procesos quieres automatizar?',
        placeholder: 'Ej.: pasar los contactos del formulario al CRM y enviarles un email de seguimiento',
        kind: 'textarea',
      },
      {
        name: 'ia_herramientas',
        label: '¿Qué herramientas usáis hoy?',
        placeholder: 'HubSpot, Google Sheets, Gmail, Holded…',
        kind: 'text',
      },
      {
        name: 'ia_frecuencia',
        label: '¿Cada cuánto se repiten esos procesos?',
        kind: 'single',
        options: [{ label: 'Varias veces al día' }, { label: 'Cada día' }, { label: 'Cada semana' }, { label: 'Cada mes o menos' }],
      },
      {
        name: 'ia_mantenimiento',
        label: '¿Cómo lo imaginas?',
        kind: 'single',
        options: [
          { label: 'Proyecto puntual: lo montamos y lo lleváis vosotros' },
          { label: 'Con mantenimiento y mejoras continuas' },
          { label: 'Aún no lo sé' },
        ],
      },
    ],
  },
  {
    id: 'fraccional',
    service: 'fraccional',
    title: 'Head of Growth fraccional',
    fields: [
      {
        name: 'fr_dedicacion',
        label: '¿Cuánta dedicación necesitas?',
        kind: 'single',
        options: [{ label: '1 día a la semana' }, { label: '2 días a la semana' }, { label: '3 o más' }, { label: 'No lo sé' }],
      },
      {
        name: 'fr_equipo',
        label: '¿Cuántas personas hay hoy en marketing?',
        kind: 'single',
        options: [{ label: 'Ninguna' }, { label: '1 o 2' }, { label: 'De 3 a 5' }, { label: 'Más de 5' }],
      },
      {
        name: 'fr_canales',
        label: '¿Qué canales usáis hoy?',
        placeholder: 'SEO, Google Ads, Meta Ads, email, LinkedIn…',
        kind: 'text',
      },
      {
        name: 'fr_ads',
        label: '¿Cuánto invertís al mes en anuncios?',
        kind: 'single',
        options: [
          { label: 'Nada' },
          { label: 'Menos de 2.000 €' },
          { label: 'Entre 2.000 y 10.000 €' },
          { label: 'Más de 10.000 €' },
        ],
      },
      {
        name: 'fr_duracion',
        label: '¿Durante cuánto tiempo?',
        kind: 'single',
        options: [{ label: '3 meses' }, { label: '6 meses' }, { label: '12 meses o más' }, { label: 'No lo sé' }],
      },
    ],
  },
  {
    id: 'formacion',
    service: 'formacion',
    title: 'Formación',
    fields: [
      {
        name: 'fo_tipo',
        label: '¿Qué buscas?',
        kind: 'single',
        options: [{ label: 'Formación para el equipo' }, { label: 'Ponencia en un evento' }],
      },
      {
        name: 'fo_asistentes',
        label: '¿Cuántas personas asistirían?',
        kind: 'single',
        options: [{ label: 'Hasta 10' }, { label: 'De 10 a 30' }, { label: 'Más de 30' }],
      },
      {
        name: 'fo_nivel',
        label: '¿Qué nivel tienen?',
        kind: 'single',
        options: [{ label: 'Inicial' }, { label: 'Intermedio' }, { label: 'Avanzado' }, { label: 'Mixto' }],
      },
      {
        name: 'fo_formato',
        label: '¿Formato?',
        kind: 'single',
        options: [{ label: 'Online' }, { label: 'Presencial', detail: 'Ciudad' }],
      },
      {
        name: 'fo_horas',
        label: '¿Cuántas horas en total?',
        kind: 'single',
        options: [{ label: 'Menos de 4 h' }, { label: 'De 4 a 8 h' }, { label: 'Más de 8 h' }, { label: 'No lo sé' }],
      },
      {
        name: 'fo_temas',
        label: '¿Qué temas te interesan?',
        placeholder: 'SEO, GEO, IA aplicada a marketing…',
        kind: 'text',
      },
    ],
  },
  {
    id: 'proyecto',
    title: 'Plazos e inversión',
    intro: 'Me ayuda a proponerte el alcance que encaja con lo que tienes en mente.',
    fields: [
      {
        name: 'pr_fecha',
        label: '¿Para cuándo lo necesitas?',
        placeholder: 'Ej.: antes de septiembre, para una campaña',
        kind: 'text',
      },
      {
        name: 'pr_mensual',
        label: 'Inversión mensual aproximada',
        kind: 'single',
        required: true,
        options: [
          { label: 'Entre 1.000 y 2.500 €/mes' },
          { label: 'Entre 2.500 y 5.000 €/mes' },
          { label: 'Más de 5.000 €/mes' },
        ],
      },
    ],
  },
  {
    id: 'extra',
    title: 'Algo más',
    fields: [
      {
        name: 'extra',
        label: '¿Hay algo más que deba saber?',
        placeholder: 'Otros servicios, ideas, dudas, enlaces a webs que te gustan…',
        kind: 'textarea',
      },
    ],
  },
];

/** Nombre del campo de texto asociado a una opción con `detail` */
export const detailFieldName = (fieldName: string, optionIndex: number) => `${fieldName}__${optionIndex}`;

/** Un campo se pide si su sección y sus condiciones encajan con los servicios marcados */
export const isFieldActive = (section: BriefSection, field: BriefField, selected: ReadonlySet<ServiceId>) =>
  (!section.service || selected.has(section.service)) &&
  (!field.hideWith || !selected.has(field.hideWith)) &&
  (!field.showWith || field.showWith.some((service) => selected.has(service)));
