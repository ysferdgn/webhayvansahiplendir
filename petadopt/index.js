const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB bağlantısı BAŞARILI'))
  .catch(err => console.error('❌ MongoDB bağlantı HATASI:', err));

// Basit test endpoint
app.get('/', (req, res) => {
  res.send('🎉 Backend çalışıyor!');
});

// Rotalar
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/upload', require('./routes/upload'));

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
}); 