/**
 * Briefing de presupuesto (/presupuesto/ y /en/quote/): servicios y preguntas. Lo usan el formulario
 * (src/components/BriefForm.astro) y la Pages Function que lo envía (functions/api/brief.ts),
 * así las etiquetas del email coinciden siempre con las del formulario.
 *
 * Los ids de servicio se usan en `?servicios=web,geo` (también en inglés) y en las reglas CSS de BriefForm.astro:
 * si se añade un servicio, hay que añadir también sus reglas allí.
 */
import type { Lang } from '../i18n/ui';

export type ServiceId = 'web' | 'geo' | 'ia' | 'fraccional' | 'formacion';

/** Texto en los dos idiomas del sitio. El email a Nacho usa siempre `es` */
export type Localized = Record<Lang, string>;

export interface BriefService {
  id: ServiceId;
  label: Localized;
  /** Etiqueta corta para el asunto del email (solo en español) */
  shortLabel: string;
  description: Localized;
}

export interface BriefOption {
  label: Localized;
  /** Placeholder de un campo de texto que aparece al marcar la opción (p. ej. "¿Cuál?") */
  detail?: Localized;
}

export interface BriefField {
  name: string;
  label: Localized;
  kind: 'text' | 'textarea' | 'single' | 'multi';
  /** El formulario envía el índice de la opción, así la respuesta no depende del idioma */
  options?: BriefOption[];
  hint?: Localized;
  placeholder?: Localized;
  /** Obligatorio (solo en campos que se muestran siempre: los ocultos no pasarían la validación nativa) */
  required?: boolean;
  /** Solo se muestra si está marcado alguno de estos servicios */
  showWith?: ServiceId[];
  /** Se oculta si está marcado este servicio */
  hideWith?: ServiceId;
}

export interface BriefSection {
  id: string;
  title: Localized;
  intro?: Localized;
  /** Sin servicio, la sección se muestra siempre */
  service?: ServiceId;
  fields: BriefField[];
}

export const briefServices: BriefService[] = [
  {
    id: 'web',
    label: { es: 'Web nueva', en: 'New website' },
    shortLabel: 'Web',
    description: {
      es: 'Diseño y desarrollo de tu web: rápida, fácil de gestionar y preparada para SEO.',
      en: 'Design and development of your website: fast, easy to manage and built for SEO.',
    },
  },
  {
    id: 'geo',
    label: { es: 'SEO y GEO', en: 'SEO & GEO' },
    shortLabel: 'SEO/GEO',
    description: {
      es: 'Que te encuentren en Google y te recomienden ChatGPT, Perplexity o Gemini.',
      en: 'Get found on Google and recommended by ChatGPT, Perplexity or Gemini.',
    },
  },
  {
    id: 'ia',
    label: { es: 'IA y automatización', en: 'AI & automation' },
    shortLabel: 'IA',
    description: {
      es: 'Procesos que hoy se hacen a mano, resueltos con IA y automatizaciones.',
      en: 'Processes you handle by hand today, solved with AI and automation.',
    },
  },
  {
    id: 'fraccional',
    label: { es: 'Head of Growth fraccional', en: 'Fractional Head of Growth' },
    shortLabel: 'Fraccional',
    description: {
      es: 'Dirección de growth unos días a la semana, sin contratar a tiempo completo.',
      en: 'Growth leadership a few days a week, without a full-time hire.',
    },
  },
  {
    id: 'formacion',
    label: { es: 'Formación', en: 'Training' },
    shortLabel: 'Formación',
    description: {
      es: 'Talleres y ponencias de SEO, GEO e IA para tu equipo o tu evento.',
      en: 'SEO, GEO and AI workshops and talks for your team or your event.',
    },
  },
];

const OTHER: BriefOption = { label: { es: 'Otro', en: 'Other' }, detail: { es: '¿Cuál?', en: 'Which one?' } };

export const briefSections: BriefSection[] = [
  {
    id: 'web',
    service: 'web',
    title: { es: 'Tu web', en: 'Your website' },
    fields: [
      {
        name: 'web_objetivo',
        label: { es: '¿Qué tiene que conseguir la web?', en: 'What does the website need to achieve?' },
        kind: 'multi',
        options: [
          { label: { es: 'Captar contactos y clientes', en: 'Generate leads and customers' } },
          { label: { es: 'Vender online', en: 'Sell online' } },
          { label: { es: 'Reservas o citas', en: 'Bookings or appointments' } },
          { label: { es: 'Imagen y credibilidad', en: 'Brand image and credibility' } },
          OTHER,
        ],
      },
      {
        name: 'web_funcionalidades',
        label: { es: '¿Qué tiene que poder hacer?', en: 'What does it need to be able to do?' },
        kind: 'multi',
        options: [
          { label: { es: 'Formulario de contacto', en: 'Contact form' } },
          { label: { es: 'Reservas o citas online', en: 'Online bookings or appointments' } },
          {
            label: { es: 'Tienda online', en: 'Online store' },
            detail: { es: 'Nº aproximado de productos', en: 'Approximate number of products' },
          },
          {
            label: { es: 'Varios idiomas', en: 'Multiple languages' },
            detail: { es: '¿Cuáles?', en: 'Which ones?' },
          },
          { label: { es: 'Área privada para clientes', en: 'Private client area' } },
          { label: { es: 'Blog o noticias', en: 'Blog or news' } },
          OTHER,
        ],
      },
      {
        name: 'web_integraciones',
        label: {
          es: '¿Con qué herramientas tiene que conectarse?',
          en: 'Which tools does it need to connect to?',
        },
        kind: 'multi',
        options: [
          {
            label: { es: 'CRM', en: 'CRM' },
            detail: { es: '¿Cuál? (HubSpot, Pipedrive…)', en: 'Which one? (HubSpot, Pipedrive…)' },
          },
          {
            label: { es: 'Newsletter o email marketing', en: 'Newsletter or email marketing' },
            detail: { es: '¿Cuál?', en: 'Which one?' },
          },
          {
            label: { es: 'Pasarela de pago', en: 'Payment gateway' },
            detail: { es: '¿Cuál?', en: 'Which one?' },
          },
          { label: { es: 'Calendario o agenda', en: 'Calendar or scheduling' } },
          { label: { es: 'Analítica y píxeles de anuncios', en: 'Analytics and ad pixels' } },
          OTHER,
        ],
      },
      {
        name: 'web_edicion',
        label: { es: '¿Vais a editar la web vosotros?', en: 'Will you be editing the website yourselves?' },
        kind: 'single',
        options: [
          { label: { es: 'Sí, a menudo', en: 'Yes, often' } },
          { label: { es: 'De vez en cuando', en: 'Now and then' } },
          { label: { es: 'No, preferimos que la gestiones tú', en: 'No, we would rather you manage it' } },
        ],
      },
      {
        name: 'web_marca',
        label: { es: '¿Tenéis identidad de marca?', en: 'Do you have a brand identity?' },
        kind: 'single',
        options: [
          { label: { es: 'Logo y manual de marca', en: 'Logo and brand guidelines' } },
          { label: { es: 'Solo logo', en: 'Logo only' } },
          { label: { es: 'No, hay que crearla', en: 'No, it needs to be created' } },
        ],
      },
      {
        name: 'web_textos',
        label: { es: '¿Quién escribe los textos?', en: 'Who writes the copy?' },
        kind: 'single',
        options: [
          { label: { es: 'Los aportamos nosotros', en: 'We provide it' } },
          { label: { es: 'Los redactas tú', en: 'You write it' } },
          { label: { es: 'Una mezcla', en: 'A mix of both' } },
        ],
      },
      {
        name: 'web_fotos',
        label: { es: '¿Y las fotos?', en: 'And the photos?' },
        kind: 'single',
        options: [
          { label: { es: 'Tenemos fotos propias', en: 'We have our own photos' } },
          { label: { es: 'Banco de imágenes', en: 'Stock images' } },
          { label: { es: 'Genéralas tú con IA', en: 'Generate them with AI' } },
        ],
      },
      {
        name: 'web_actual_paginas',
        label: {
          es: 'Si ya tienes web, ¿cuántas páginas tiene más o menos?',
          en: 'If you already have a website, roughly how many pages does it have?',
        },
        kind: 'single',
        options: [
          { label: { es: 'No tenemos web', en: 'We have no website' } },
          { label: { es: 'Menos de 20', en: 'Fewer than 20' } },
          { label: { es: 'Entre 20 y 100', en: 'Between 20 and 100' } },
          { label: { es: 'Más de 100', en: 'More than 100' } },
        ],
      },
      {
        name: 'web_actual_trafico',
        label: { es: '¿Recibe visitas desde Google?', en: 'Does it get visits from Google?' },
        kind: 'single',
        options: [
          { label: { es: 'Sí, bastantes', en: 'Yes, quite a lot' } },
          { label: { es: 'Pocas', en: 'A few' } },
          { label: { es: 'No lo sé', en: 'I don’t know' } },
        ],
      },
      {
        name: 'web_migracion',
        label: { es: '¿Quieres que incluya la migración SEO?', en: 'Should I include the SEO migration?' },
        hint: {
          es: 'Redirecciones y revisión del cambio para no perder el tráfico que ya recibe tu web actual.',
          en: 'Redirects and a post-launch review so you don’t lose the traffic your current site already gets.',
        },
        kind: 'single',
        options: [
          { label: { es: 'Sí, inclúyela', en: 'Yes, include it' } },
          { label: { es: 'No', en: 'No' } },
          { label: { es: 'No tenemos web actual', en: 'We have no current website' } },
        ],
      },
    ],
  },
  {
    id: 'geo',
    service: 'geo',
    title: { es: 'SEO y GEO', en: 'SEO & GEO' },
    fields: [
      {
        name: 'geo_preguntas',
        label: {
          es: '¿En qué búsquedas o preguntas te gustaría aparecer?',
          en: 'Which searches or questions would you like to show up for?',
        },
        hint: {
          es: 'Lo que tus clientes preguntarían a Google o a ChatGPT. Si no lo tienes claro, déjalo en blanco: te propongo yo las búsquedas.',
          en: 'What your customers would ask Google or ChatGPT. If you’re not sure, leave it blank and I’ll suggest the searches.',
        },
        placeholder: {
          es: 'Ej.: «mejor gestoría para autónomos en Sevilla»',
          en: 'E.g. “best accounting firm for freelancers in London”',
        },
        kind: 'textarea',
      },
      {
        name: 'geo_ambito',
        label: { es: '¿Dónde están tus clientes?', en: 'Where are your customers?' },
        kind: 'single',
        options: [
          { label: { es: 'Local', en: 'Local' }, detail: { es: 'Ciudad o zona', en: 'City or area' } },
          { label: { es: 'En toda España', en: 'Nationwide' } },
          { label: { es: 'Internacional', en: 'International' }, detail: { es: 'Países', en: 'Countries' } },
        ],
      },
      {
        name: 'geo_idiomas',
        label: { es: '¿En qué idiomas?', en: 'In which languages?' },
        placeholder: { es: 'Español, inglés…', en: 'English, Spanish…' },
        kind: 'text',
      },
      {
        name: 'geo_objetivo',
        label: { es: '¿Qué es lo más importante para ti?', en: 'What matters most to you?' },
        kind: 'single',
        options: [
          { label: { es: 'Conseguir más contactos y clientes', en: 'Getting more leads and customers' } },
          { label: { es: 'Que la marca sea más conocida', en: 'Building brand awareness' } },
          {
            label: { es: 'Superar a un competidor', en: 'Outranking a competitor' },
            detail: { es: '¿Cuál?', en: 'Which one?' },
          },
        ],
      },
      {
        name: 'geo_expertos',
        label: {
          es: '¿Hay alguien en el equipo que pueda revisar o firmar contenido como experto?',
          en: 'Is there someone on your team who can review or sign off content as a subject-matter expert?',
        },
        kind: 'single',
        options: [
          {
            label: { es: 'Sí', en: 'Yes' },
            detail: { es: 'Horas al mes que podría dedicar', en: 'Hours per month they could spare' },
          },
          { label: { es: 'No', en: 'No' } },
        ],
      },
      {
        name: 'geo_cms',
        label: { es: '¿Con qué está hecha tu web actual?', en: 'What is your current website built with?' },
        kind: 'single',
        hideWith: 'web',
        options: [
          { label: { es: 'WordPress', en: 'WordPress' } },
          { label: { es: 'Shopify', en: 'Shopify' } },
          { label: { es: 'Wix o Squarespace', en: 'Wix or Squarespace' } },
          { label: { es: 'Desarrollo a medida', en: 'Custom-built' } },
          { label: { es: 'No lo sé', en: 'I don’t know' } },
          OTHER,
        ],
      },
      {
        name: 'geo_cambios',
        label: {
          es: '¿Quién puede hacer cambios técnicos en la web?',
          en: 'Who can make technical changes to the website?',
        },
        kind: 'single',
        hideWith: 'web',
        options: [
          { label: { es: 'Alguien del equipo', en: 'Someone on the team' } },
          { label: { es: 'Una agencia o freelance', en: 'An agency or freelancer' } },
          { label: { es: 'Nadie ahora mismo', en: 'Nobody right now' } },
        ],
      },
    ],
  },
  {
    id: 'ia',
    service: 'ia',
    title: { es: 'IA y automatización', en: 'AI & automation' },
    fields: [
      {
        name: 'ia_procesos',
        label: { es: '¿Qué procesos quieres automatizar?', en: 'Which processes do you want to automate?' },
        placeholder: {
          es: 'Ej.: pasar los contactos del formulario al CRM y enviarles un email de seguimiento',
          en: 'E.g. send form leads to the CRM and trigger a follow-up email',
        },
        kind: 'textarea',
      },
      {
        name: 'ia_herramientas',
        label: { es: '¿Qué herramientas usáis hoy?', en: 'Which tools do you use today?' },
        placeholder: {
          es: 'HubSpot, Google Sheets, Gmail, Holded…',
          en: 'HubSpot, Google Sheets, Gmail, Xero…',
        },
        kind: 'text',
      },
      {
        name: 'ia_frecuencia',
        label: { es: '¿Cada cuánto se repiten esos procesos?', en: 'How often do these processes repeat?' },
        kind: 'single',
        options: [
          { label: { es: 'Varias veces al día', en: 'Several times a day' } },
          { label: { es: 'Cada día', en: 'Daily' } },
          { label: { es: 'Cada semana', en: 'Weekly' } },
          { label: { es: 'Cada mes o menos', en: 'Monthly or less' } },
        ],
      },
      {
        name: 'ia_mantenimiento',
        label: { es: '¿Cómo lo imaginas?', en: 'How do you picture it?' },
        kind: 'single',
        options: [
          {
            label: {
              es: 'Proyecto puntual: lo montamos y lo lleváis vosotros',
              en: 'One-off project: we build it and you run it',
            },
          },
          {
            label: { es: 'Con mantenimiento y mejoras continuas', en: 'With ongoing maintenance and improvements' },
          },
          { label: { es: 'Aún no lo sé', en: 'Not sure yet' } },
        ],
      },
    ],
  },
  {
    id: 'fraccional',
    service: 'fraccional',
    title: { es: 'Head of Growth fraccional', en: 'Fractional Head of Growth' },
    fields: [
      {
        name: 'fr_dedicacion',
        label: { es: '¿Cuánta dedicación necesitas?', en: 'How much time do you need?' },
        kind: 'single',
        options: [
          { label: { es: '1 día a la semana', en: '1 day a week' } },
          { label: { es: '2 días a la semana', en: '2 days a week' } },
          { label: { es: '3 o más', en: '3 or more' } },
          { label: { es: 'No lo sé', en: 'I don’t know' } },
        ],
      },
      {
        name: 'fr_equipo',
        label: { es: '¿Cuántas personas hay hoy en marketing?', en: 'How many people are in marketing today?' },
        kind: 'single',
        options: [
          { label: { es: 'Ninguna', en: 'None' } },
          { label: { es: '1 o 2', en: '1 or 2' } },
          { label: { es: 'De 3 a 5', en: '3 to 5' } },
          { label: { es: 'Más de 5', en: 'More than 5' } },
        ],
      },
      {
        name: 'fr_canales',
        label: { es: '¿Qué canales usáis hoy?', en: 'Which channels do you use today?' },
        placeholder: {
          es: 'SEO, Google Ads, Meta Ads, email, LinkedIn…',
          en: 'SEO, Google Ads, Meta Ads, email, LinkedIn…',
        },
        kind: 'text',
      },
      {
        name: 'fr_ads',
        label: { es: '¿Cuánto invertís al mes en anuncios?', en: 'How much do you spend on ads each month?' },
        kind: 'single',
        options: [
          { label: { es: 'Nada', en: 'Nothing' } },
          { label: { es: 'Menos de 2.000 €', en: 'Less than €2,000' } },
          { label: { es: 'Entre 2.000 y 10.000 €', en: '€2,000–10,000' } },
          { label: { es: 'Más de 10.000 €', en: 'More than €10,000' } },
        ],
      },
      {
        name: 'fr_duracion',
        label: { es: '¿Durante cuánto tiempo?', en: 'For how long?' },
        kind: 'single',
        options: [
          { label: { es: '3 meses', en: '3 months' } },
          { label: { es: '6 meses', en: '6 months' } },
          { label: { es: '12 meses o más', en: '12 months or more' } },
          { label: { es: 'No lo sé', en: 'I don’t know' } },
        ],
      },
    ],
  },
  {
    id: 'formacion',
    service: 'formacion',
    title: { es: 'Formación', en: 'Training' },
    fields: [
      {
        name: 'fo_tipo',
        label: { es: '¿Qué buscas?', en: 'What are you looking for?' },
        kind: 'single',
        options: [
          { label: { es: 'Formación para el equipo', en: 'Training for your team' } },
          { label: { es: 'Ponencia en un evento', en: 'A talk at an event' } },
        ],
      },
      {
        name: 'fo_asistentes',
        label: { es: '¿Cuántas personas asistirían?', en: 'How many people would attend?' },
        kind: 'single',
        options: [
          { label: { es: 'Hasta 10', en: 'Up to 10' } },
          { label: { es: 'De 10 a 30', en: '10 to 30' } },
          { label: { es: 'Más de 30', en: 'More than 30' } },
        ],
      },
      {
        name: 'fo_nivel',
        label: { es: '¿Qué nivel tienen?', en: 'What is their level?' },
        kind: 'single',
        options: [
          { label: { es: 'Inicial', en: 'Beginner' } },
          { label: { es: 'Intermedio', en: 'Intermediate' } },
          { label: { es: 'Avanzado', en: 'Advanced' } },
          { label: { es: 'Mixto', en: 'Mixed' } },
        ],
      },
      {
        name: 'fo_formato',
        label: { es: '¿Formato?', en: 'Format?' },
        kind: 'single',
        options: [
          { label: { es: 'Online', en: 'Online' } },
          { label: { es: 'Presencial', en: 'In person' }, detail: { es: 'Ciudad', en: 'City' } },
        ],
      },
      {
        name: 'fo_horas',
        label: { es: '¿Cuántas horas en total?', en: 'How many hours in total?' },
        kind: 'single',
        options: [
          { label: { es: 'Menos de 4 h', en: 'Less than 4 h' } },
          { label: { es: 'De 4 a 8 h', en: '4 to 8 h' } },
          { label: { es: 'Más de 8 h', en: 'More than 8 h' } },
          { label: { es: 'No lo sé', en: 'I don’t know' } },
        ],
      },
      {
        name: 'fo_temas',
        label: { es: '¿Qué temas te interesan?', en: 'Which topics interest you?' },
        placeholder: {
          es: 'SEO, GEO, IA aplicada a marketing…',
          en: 'SEO, GEO, AI applied to marketing…',
        },
        kind: 'text',
      },
    ],
  },
  {
    id: 'proyecto',
    title: { es: 'Plazos e inversión', en: 'Timeline & budget' },
    intro: {
      es: 'Me ayuda a proponerte el alcance que encaja con lo que tienes en mente.',
      en: 'This helps me propose a scope that fits what you have in mind.',
    },
    fields: [
      {
        name: 'pr_fecha',
        label: { es: '¿Para cuándo lo necesitas?', en: 'When do you need it?' },
        placeholder: {
          es: 'Ej.: antes de septiembre, para una campaña',
          en: 'E.g. before September, for a campaign launch',
        },
        kind: 'text',
      },
      {
        name: 'pr_mensual',
        label: { es: 'Inversión mensual aproximada', en: 'Approximate monthly budget' },
        kind: 'single',
        required: true,
        options: [
          { label: { es: 'Entre 1.000 y 2.500 €/mes', en: '€1,000–2,500/month' } },
          { label: { es: 'Entre 2.500 y 5.000 €/mes', en: '€2,500–5,000/month' } },
          { label: { es: 'Más de 5.000 €/mes', en: 'More than €5,000/month' } },
        ],
      },
    ],
  },
  {
    id: 'extra',
    title: { es: 'Algo más', en: 'Anything else' },
    fields: [
      {
        name: 'extra',
        label: { es: '¿Hay algo más que deba saber?', en: 'Is there anything else I should know?' },
        placeholder: {
          es: 'Otros servicios, ideas, dudas, enlaces a webs que te gustan…',
          en: 'Other services, ideas, questions, links to websites you like…',
        },
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
