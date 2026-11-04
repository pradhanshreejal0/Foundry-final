import mongoose from "mongoose";

const currencyRateSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  rate: {
    type: Number,
    required: true,
    default: 1.0
  },
  symbol: {
    type: String,
    default: '$'
  }
}, { timestamps: true });

export default mongoose.model('CurrencyRate', currencyRateSchema);
