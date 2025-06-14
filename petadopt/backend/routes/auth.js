// routes/auth.js
const router = require("express").Router();
const User   = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hash });
    const saved = await user.save();
    res.status(201).json({ message: "Kayıt başarılı", userId: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).json({ error: "Şifre yanlış" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    res.json({ message: "Giriş başarılı", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
