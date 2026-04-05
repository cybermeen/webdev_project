const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const scrapbookRoutes = require('./routes/scrapbook');
const todoRoutes = require('./routes/to-do');
const progressRoutes = require('./routes/progress'); // ADD THIS

app.use('/api/scrapbook', scrapbookRoutes);
app.use('/api/todo', todoRoutes);
app.use('/api/progress', progressRoutes); // ADD THIS

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});