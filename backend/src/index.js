import "dotenv/config";

import express from 'express';
import cors from 'cors';
import fs from 'fs'
import path from 'path'

import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './lib/db.js';

import job from './lib/cron.js'
import clerkWebhook from './webhooks/clerk.webhook.js'
import User from './models/user.model.js';
import authRoutes from './routes/auth.route.js'

const publicDir = path.join(process.cwd(), "public");
const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL

app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);
app.use("/api/auth", authRoutes);

app.use(express.json());
app.use(cors({
  origin:FRONTEND_URL,
  credentials:true 
}));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ healthy : "running"})
});

//if public directory serve the static files for Production
if(fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"),
    (err) => (next));
  });
};

app.listen(PORT, () => {
  connectDB();
  console.log("Server is up and running on PORT:", PORT);
});

if (process.env.NODE_ENV === "production") {
  job.start()
}