import ThemeSettings from "../models/ThemeSettings.js";
import Banner from "../models/Banner.js";
import CurrencyRate from "../models/CurrencyRate.js";

// Get theme settings (singleton or first record)
export const getThemeSettings = async (req, res, next) => {
  try {
    let settings = await ThemeSettings.findOne();
    if (!settings) {
      settings = await ThemeSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// Update theme settings
export const updateThemeSettings = async (req, res, next) => {
  try {
    let settings = await ThemeSettings.findOne();
    if (!settings) {
      settings = new ThemeSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// Get all banners
export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ position: 1 });
    if (!banners || banners.length === 0) {
      return res.json({
        success: true,
        data: [
          {
            _id: 'default-1',
            title: 'NEW SEIKO AUTOMATIC',
            subtitle: 'Precision craftsmanship & timeless elegance',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1600',
            linkUrl: '/shop',
            buttonText: 'Shop Now',
            position: 0
          },
          {
            _id: 'default-2',
            title: 'LIMITED EDITION COLLECTION',
            subtitle: 'Discover exclusive designs and heritage dials',
            imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1600',
            linkUrl: '/shop',
            buttonText: 'Explore Collection',
            position: 1
          }
        ]
      });
    }
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all banners (including inactive)
export const adminGetBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ position: 1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
};

// Admin: Create banner
export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

// Admin: Update banner
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete banner
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get currencies and rates
export const getCurrencies = async (req, res, next) => {
  try {
    let rates = await CurrencyRate.find();
    if (!rates || rates.length === 0) {
      rates = [
        { code: 'USD', rate: 1.0, symbol: '$' },
        { code: 'EUR', rate: 0.92, symbol: '€' },
        { code: 'GBP', rate: 0.79, symbol: '£' },
        { code: 'JPY', rate: 154.5, symbol: '¥' },
        { code: 'CAD', rate: 1.35, symbol: 'CA$' }
      ];
    }
    res.json({ success: true, data: rates });
  } catch (error) {
    next(error);
  }
};
