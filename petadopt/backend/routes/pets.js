// routes/pets.js
const router = require("express").Router();
const Pet = require("../models/pet");
const verifyToken = require("../middlewares/verifyToken");

// Yeni ilan ekle
router.post("/", verifyToken, async (req, res) => {
  try {
    const pet = new Pet({ ...req.body, ownerId: req.user.id });
    const saved = await pet.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tüm ilanları listele
router.get("/", async (req, res) => {
  try {
    const list = await Pet.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kendi ilanlarını getir
router.get("/my", verifyToken, async (req, res) => {
  try {
    const mine = await Pet.find({ ownerId: req.user.id });
    res.json(mine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// İlan güncelle
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: "İlan bulunamadı" });
    if (pet.ownerId.toString() !== req.user.id)
      return res.status(403).json({ error: "Yetkisiz erişim" });

    const updated = await Pet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// İlan sil
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: "İlan bulunamadı" });
    if (pet.ownerId.toString() !== req.user.id)
      return res.status(403).json({ error: "Yetkisiz erişim" });

    await pet.deleteOne();
    res.json({ message: "İlan silindi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
