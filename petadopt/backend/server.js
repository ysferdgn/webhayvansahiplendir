const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');

const app = express();

// Multer ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Sadece resim dosyalarını kabul et
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
    cb(null, true);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// Dosya yükleme route'u
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenemedi' });
    }
    res.json({ 
      message: 'Dosya başarıyla yüklendi',
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Dosya yüklenirken bir hata oluştu' });
  }
});

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/petadopt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Uploads klasörünü oluştur
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 