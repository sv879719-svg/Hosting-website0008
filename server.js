require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// JSON DB
require('./db');

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hosting', require('./routes/hosting'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/users', require('./routes/users'));

// Serve frontend build (created after postinstall)
const frontendBuild = path.join(__dirname, 'frontend', 'build');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ ProHost running on port ${PORT}`));