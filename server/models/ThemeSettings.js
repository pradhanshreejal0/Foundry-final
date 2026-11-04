import mongoose from "mongoose";

const themeSettingsSchema = new mongoose.Schema({
  announcementText: {
    type: String,
    default: 'FREE SHIPPING ON ORDERS OVER $50 • USE CODE SEIKO20'
  },
  countdownTarget: {
    type: Date,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000)
  },
  announcementEnabled: {
    type: Boolean,
    default: true
  },
  defaultCurrency: {
    type: String,
    default: 'USD'
  },
  supportedCurrencies: {
    type: [String],
    default: ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
  },
  storeName: {
    type: String,
    default: 'Seiko Store'
  },
  primaryColor: {
    type: String,
    default: '#000000'
  }
}, { timestamps: true });

export default mongoose.model('ThemeSettings', themeSettingsSchema);
