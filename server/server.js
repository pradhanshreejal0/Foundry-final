// =====================================================
// E-commerce API entry point (Express + MongoDB)
// =====================================================
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import compression from "compression";

import {
  loginLimiter,
  forgotPasswordLimiter,
  registerLimiter,
} from "./middleware/rateLimiters.js";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import categoryIconRoutes from "./routes/categoryIconRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import adRoutes from "./routes/adRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";

dotenv.config();

// ---------- Startup Env & Security Checks ----------
const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
];

const recommendedEnv = [
  "PUBLIC_URL",
  "ALLOWED_ORIGINS",
];

const missingRequired = requiredEnv.filter((key) => !process.env[key]);
if (missingRequired.length > 0) {
  console.error(`❌ CRITICAL: Missing required environment variables: ${missingRequired.join(", ")}`);
  process.exit(1);
}

const missingRecommended = recommendedEnv.filter((key) => !process.env[key]);
if (missingRecommended.length > 0) {
  console.warn(`⚠️ WARNING: Missing recommended environment variables: ${missingRecommended.join(", ")}`);
}

if (!process.env.PUBLIC_URL) {
  process.env.PUBLIC_URL = "https://foundry-zycd.onrender.com";
}

if (process.env.NODE_ENV === "production") {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error("❌ CRITICAL: JWT_SECRET must be at least 32 characters long in production.");
    process.exit(1);
  }
  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    console.error("❌ CRITICAL: JWT_REFRESH_SECRET must be at least 32 characters long in production.");
    process.exit(1);
  }
}

const app = express();

// Proxy and real client IP setup
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS) || 2;
app.set("trust proxy", trustProxyHops);
app.disable("x-powered-by");

// Compression middleware
app.use(compression());

// Basic security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)",
  );
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  next();
});

// Cache-Control no-store on authenticated requests
app.use((req, res, next) => {
  if (req.headers.authorization || req.cookies?.refreshToken) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  }
  next();
});

// ---------- Database ----------
connectDB()
  .then(() => (app.locals.dbReady = true))
  .catch(() => (app.locals.dbReady = false));

// Health & version endpoints
const handleHealth = (req, res) => {
  const ready = req.app.locals.dbReady;
  const dbState = mongoose.connection.readyState;
  res.status(ready && dbState === 1 ? 200 : 503).json({
    status: ready && dbState === 1 ? "ok" : "degraded",
    database: dbState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
};

app.get("/health", handleHealth);
app.get("/api/health", handleHealth);

app.get("/api/version", (req, res) => {
  res.json({
    name: "foundry-server",
    version: "1.0.0",
    nodeEnv: process.env.NODE_ENV || "development",
    onlinePaymentsEnabled: process.env.ONLINE_PAYMENTS_ENABLED === "true",
  });
});

// Temporary protected debug endpoint to verify real IP behind proxy
app.get("/api/debug/ip", (req, res) => {
  res.json({
    ip: req.ip,
    ips: req.ips,
    xForwardedFor: req.headers["x-forwarded-for"] || null,
    xRealIp: req.headers["x-real-ip"] || null,
  });
});

// ---------- CORS ----------
const allowedOriginsEnv =
  process.env.ALLOWED_ORIGINS ||
  "https://foundry-zycd.onrender.com,http://localhost:5173";
const allowedOrigins =
  allowedOriginsEnv === "*"
    ? ["*"]
    : allowedOriginsEnv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

if (process.env.CLIENT_URL) {
  console.warn("⚠️ DEPRECATED: CLIENT_URL is deprecated. Use PUBLIC_URL and ALLOWED_ORIGINS instead.");
  const legacyClient = process.env.CLIENT_URL.replace(/^["']|["']$/g, "").trim();
  if (legacyClient && !allowedOrigins.includes(legacyClient)) {
    allowedOrigins.push(legacyClient);
  }
}

if (!allowedOrigins.includes("*")) {
  if (!allowedOrigins.includes("https://foundry-zycd.onrender.com")) {
    allowedOrigins.push("https://foundry-zycd.onrender.com");
  }
  if (!allowedOrigins.includes("http://localhost:5173")) {
    allowedOrigins.push("http://localhost:5173");
  }
}

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  }),
);

// ---------- Body / cookie parsing ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());

// Brute-force protection on sensitive auth endpoints
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", registerLimiter);
app.use("/api/auth/forgot-password", forgotPasswordLimiter);

// ---------- Routes ----------
const routes = {
  auth: authRoutes,
  categories: categoryRoutes,
  "category-icons": categoryIconRoutes,
  vendors: vendorRoutes,
  ads: adRoutes,
  upload: uploadRoutes,
  products: productRoutes,
  cart: cartRoutes,
  orders: orderRoutes,
  payments: paymentRoutes,
  coupons: couponRoutes,
  returns: returnRoutes,
  payouts: payoutRoutes,
  stats: statsRoutes,
  wishlist: wishlistRoutes,
  reviews: reviewRoutes,
  users: userRoutes,
  settings: settingsRoutes,
  homepage: homepageRoutes,
  chats: chatRoutes,
  contact: contactRoutes,
  newsletter: newsletterRoutes,
  theme: themeRoutes,
};

for (const [path, router] of Object.entries(routes))
  app.use(`/api/${path}`, router);

app.get("/", (req, res) =>
  res.json({ success: true, message: "Foundry E-commerce API is running" }),
);

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const status = Number(err.status || err.statusCode) || 500;
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  res.status(safeStatus).json({
    message:
      safeStatus >= 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} (Env: ${process.env.NODE_ENV || "development"})`),
);

// Graceful shutdown on SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});
