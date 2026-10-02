import {t} from './i18n';

export interface Option {
  value: number;
  text: string;
}

export interface Fruit extends Option {
  category: string;
  color: string;
  kcal: number;
  seasonal: boolean;
}

export interface Country {
  code: string;
  name: string;
  continent: { name: string };
}

const L = t({
  en: {
    option: 'Option', item: 'Item',
    citrus: 'Citrus', berries: 'Berries', pome: 'Pome fruits', tropical: 'Tropical',
    europe: 'Europe', america: 'America', asia: 'Asia', africa: 'Africa', oceania: 'Oceania'
  },
  it: {
    option: 'Opzione', item: 'Elemento',
    citrus: 'Agrumi', berries: 'Frutti di bosco', pome: 'Pomacee', tropical: 'Tropicali',
    europe: 'Europa', america: 'America', asia: 'Asia', africa: 'Africa', oceania: 'Oceania'
  }
});

export const SIMPLE_OPTIONS: Option[] = Array.from({length: 10}, (_, i) => ({value: i + 1, text: `${L.option} ${i + 1}`}));

export const FRUITS: Fruit[] = [
  {value: 1, text: t({en: 'Orange', it: 'Arancia'}), category: L.citrus, color: '#f97316', kcal: 47, seasonal: true},
  {value: 2, text: t({en: 'Lemon', it: 'Limone'}), category: L.citrus, color: '#eab308', kcal: 29, seasonal: true},
  {value: 3, text: t({en: 'Mandarin', it: 'Mandarino'}), category: L.citrus, color: '#fb923c', kcal: 53, seasonal: false},
  {value: 4, text: t({en: 'Grapefruit', it: 'Pompelmo'}), category: L.citrus, color: '#f43f5e', kcal: 42, seasonal: false},
  {value: 5, text: t({en: 'Strawberry', it: 'Fragola'}), category: L.berries, color: '#e11d48', kcal: 32, seasonal: true},
  {value: 6, text: t({en: 'Blueberry', it: 'Mirtillo'}), category: L.berries, color: '#4f46e5', kcal: 57, seasonal: false},
  {value: 7, text: t({en: 'Raspberry', it: 'Lampone'}), category: L.berries, color: '#db2777', kcal: 52, seasonal: true},
  {value: 8, text: t({en: 'Apple', it: 'Mela'}), category: L.pome, color: '#16a34a', kcal: 52, seasonal: true},
  {value: 9, text: t({en: 'Pear', it: 'Pera'}), category: L.pome, color: '#84cc16', kcal: 57, seasonal: false},
  {value: 10, text: t({en: 'Pineapple', it: 'Ananas'}), category: L.tropical, color: '#ca8a04', kcal: 50, seasonal: false},
  {value: 11, text: 'Mango', category: L.tropical, color: '#f59e0b', kcal: 60, seasonal: true},
  {value: 12, text: 'Banana', category: L.tropical, color: '#facc15', kcal: 89, seasonal: true}
];

export const COUNTRIES: Country[] = [
  {code: 'IT', name: t({en: 'Italy', it: 'Italia'}), continent: {name: L.europe}},
  {code: 'FR', name: t({en: 'France', it: 'Francia'}), continent: {name: L.europe}},
  {code: 'DE', name: t({en: 'Germany', it: 'Germania'}), continent: {name: L.europe}},
  {code: 'ES', name: t({en: 'Spain', it: 'Spagna'}), continent: {name: L.europe}},
  {code: 'PT', name: t({en: 'Portugal', it: 'Portogallo'}), continent: {name: L.europe}},
  {code: 'GR', name: t({en: 'Greece', it: 'Grecia'}), continent: {name: L.europe}},
  {code: 'US', name: t({en: 'United States', it: 'Stati Uniti'}), continent: {name: L.america}},
  {code: 'CA', name: 'Canada', continent: {name: L.america}},
  {code: 'MX', name: t({en: 'Mexico', it: 'Messico'}), continent: {name: L.america}},
  {code: 'BR', name: t({en: 'Brazil', it: 'Brasile'}), continent: {name: L.america}},
  {code: 'AR', name: 'Argentina', continent: {name: L.america}},
  {code: 'JP', name: t({en: 'Japan', it: 'Giappone'}), continent: {name: L.asia}},
  {code: 'CN', name: t({en: 'China', it: 'Cina'}), continent: {name: L.asia}},
  {code: 'IN', name: 'India', continent: {name: L.asia}},
  {code: 'KR', name: t({en: 'South Korea', it: 'Corea del Sud'}), continent: {name: L.asia}},
  {code: 'EG', name: t({en: 'Egypt', it: 'Egitto'}), continent: {name: L.africa}},
  {code: 'MA', name: t({en: 'Morocco', it: 'Marocco'}), continent: {name: L.africa}},
  {code: 'ZA', name: t({en: 'South Africa', it: 'Sudafrica'}), continent: {name: L.africa}},
  {code: 'AU', name: 'Australia', continent: {name: L.oceania}},
  {code: 'NZ', name: t({en: 'New Zealand', it: 'Nuova Zelanda'}), continent: {name: L.oceania}}
];

export const LONG_LIST: Option[] = Array.from({length: 80}, (_, i) => ({value: i + 1, text: `${L.item} ${i + 1}`}));

/** Base delle API del mock server (inoltrate dal proxy del dev-server). */
export const API = '/jvx-multiselect-test';
