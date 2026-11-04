import express from "express";
import {
  getThemeSettings,
  updateThemeSettings,
  getBanners,
  adminGetBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getCurrencies,
} from "../controllers/themeController.js";

const router = express.Router();

// Public routes
router.get("/settings", getThemeSettings);
router.get("/banners", getBanners);
router.get("/currencies", getCurrencies);

// Admin routes (Protected by auth middleware if desired)
router.put("/settings", updateThemeSettings);
router.get("/admin/banners", adminGetBanners);
router.post("/banners", createBanner);
router.put("/banners/:id", updateBanner);
router.delete("/banners/:id", deleteBanner);

export default router;
