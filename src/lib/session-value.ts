/**
 * Cálculos de la calculadora del valor de una sesión orgánica. Los usa el componente en el servidor (valores por
 * defecto sin JavaScript) y en el navegador.
 */

export type Model = 'sales' | 'leads' | 'ads';
export type Values = Record<string, number>;

/** Margen que deja una sesión según el modelo de negocio */
export const sessionValue = (model: Model, values: Values): number => {
  const repeat = Math.max(1, values.repeat ?? 1);
  if (model === 'sales') return (values.conv / 100) * values.ticket * repeat * (values.margin / 100);
  if (model === 'leads') return (values.conv / 100) * (values.close / 100) * values.deal * repeat * (values.margin / 100);
  return (values.rpm / 1000) * values.pages;
};

/** Campo que cambia por tipo de página: la conversión, o las páginas vistas en publicidad */
export const rateField: Record<Model, string> = { sales: 'conv', leads: 'conv', ads: 'pages' };

export interface PageType {
  name: string;
  clicks: number;
  rates: Record<Model, number>;
}

export interface PageTypeResult {
  name: string;
  clicks: number;
  perSession: number;
  monthly: number;
}

export const pageTypeResults = (model: Model, values: Values, pageTypes: PageType[]): PageTypeResult[] =>
  pageTypes.map((pageType) => {
    const perSession = sessionValue(model, { ...values, [rateField[model]]: pageType.rates[model] });
    return { name: pageType.name, clicks: pageType.clicks, perSession, monthly: perSession * pageType.clicks };
  });

/**
 * Parte de la ganancia que ya se nota en cada mes del proyecto: un 25 % al tercer mes, un 55 % al sexto, un 90 % al
 * noveno y el 100 % al año. Es una curva prudente, no una ley: el SEO casi nunca rinde desde el primer mes.
 */
const RAMP: [number, number][] = [
  [0, 0],
  [3, 0.25],
  [6, 0.55],
  [9, 0.9],
  [12, 1],
];
export const ramp = (month: number): number => {
  if (month >= 12) return 1;
  const upper = RAMP.findIndex(([at]) => at >= month);
  const [fromMonth, fromShare] = RAMP[upper - 1];
  const [toMonth, toShare] = RAMP[upper];
  return fromShare + ((toShare - fromShare) * (month - fromMonth)) / (toMonth - fromMonth);
};

export const SCENARIOS = [0.5, 1, 1.5] as const;
const PAYBACK_HORIZON = 36;

export interface Investment {
  /** Margen extra al mes cuando el proyecto rinde al 100 % */
  monthlyGain: number;
  fee: number;
  setup: number;
}

export interface Roi {
  gainYear: number;
  costYear: number;
  /** null si la inversión es 0 */
  roiYear: number | null;
  /** Mes en el que el margen acumulado cubre lo invertido; null si no llega en 36 meses */
  paybackMonth: number | null;
}

export const roi = ({ monthlyGain, fee, setup }: Investment): Roi => {
  let gain = 0;
  let gainYear = 0;
  let paybackMonth: number | null = null;
  for (let month = 1; month <= PAYBACK_HORIZON; month++) {
    gain += monthlyGain * ramp(month);
    if (month === 12) gainYear = gain;
    if (paybackMonth === null && gain > 0 && gain >= setup + fee * month) paybackMonth = month;
  }
  const costYear = setup + fee * 12;
  return { gainYear, costYear, roiYear: costYear > 0 ? (gainYear - costYear) / costYear : null, paybackMonth };
};
