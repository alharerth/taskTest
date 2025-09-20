import express from "express";
import { Link } from "../models/link.js"; // <-- named import

const router = express.Router();

// Create link
router.post("/api/links", async (req, res) => {
  const { target, slug } = req.body;

  if (!target || !/^https?:\/\//.test(target)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  let finalSlug = slug;
  if (!finalSlug) {
    finalSlug = Math.random().toString(36).substring(2, 8); // 6-char random
  }

  try {
    const exists = await Link.findOne({ slug: finalSlug });
    if (exists) return res.status(409).json({ error: "Slug already exists" });

    const newLink = await Link.create({ target, slug: finalSlug });
    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// List links
router.get("/api/links", async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect
router.get("/:slug", async (req, res) => {
  try {
    const link = await Link.findOne({ slug: req.params.slug });
    if (!link) return res.status(404).json({ error: "Not found" });

    link.clicks += 1;
    await link.save();

    res.redirect(link.target);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
