import mongoose from "mongoose";

const timezonesSchema = new mongoose.Schema(
  {
    zoneName: { type: String, required: true },
    gmtOffset: { type: Number, required: true },
    gmtOffsetName: { type: String, required: true },
    abbreviation: { type: String, required: true },
    tzName: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the updated date
    },
  }
);

const countryShema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    iso3: { type: String, required: true },
    iso2: { type: String, required: true },
    numeric_code: { type: String, required: true },
    phone_code: { type: String, required: true },
    capital: { type: String, required: false },
    currency: { type: String, required: true },
    currency_name: { type: String, required: true },
    currency_symbol: { type: String, required: true },
    tld: { type: String, required: true },
    native: { type: String, required: false },
    region: { type: String, required: false },
    subregion: { type: String, required: false },
    timezones: [timezonesSchema],
    translations: {
      kr: { type: String, required: true },
      "pt-BR": { type: String, required: false },
      pt: { type: String, required: false },
      nl: { type: String, required: false },
      hr: { type: String, required: false },
      fa: { type: String, required: false },
      de: { type: String, required: false },
      es: { type: String, required: false },
      fr: { type: String, required: false },
      ja: { type: String, required: false },
      it: { type: String, required: false },
      cn: { type: String, required: true },
      tr: { type: String, required: true },
    },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    emoji: { type: String, required: true },
    emojiU: { type: String, required: true },
    states: [{ type: mongoose.Schema.Types.ObjectId, ref: "state" }],
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the updated date
    },
  }
);

const Country = mongoose.model("country", countryShema);

export default Country;
