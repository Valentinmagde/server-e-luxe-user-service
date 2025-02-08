export default interface CountryType {
  _id: string;
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: Array<Timezones>;
  translations: Translations;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
  states: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface Timezones {
  zoneName: string;
  gmtOffset: string;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

interface Translations {
  kr: string;
  "pt-BR": string;
  pt: string;
  nl: string;
  hr: string;
  fa: string;
  de: string;
  es: string;
  fr: string;
  ja: string;
  it: string;
  cn: string;
  tr: string;
}
