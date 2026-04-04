const express = require('express');
const path = require('path'); // MUST BE HERE for both of you
const app = express();
const PORT = process.env.PORT || 5000;

// This allows the server to read the JSON you send in Postman
app.use(express.json()); 

const scrapbookRoutes = require('./routes/scrapbook');
const todoRoutes = require('./routes/to-do');

app.use('/api/scrapbook', scrapbookRoutes);
app.use('/api/todo', todoRoutes);

// This line requires 'path' to be defined at the top
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* const express = require('express');
const path = require('path'); // FIX 1: Required for the uploads folder to work
const app = express();
const PORT = process.env.PORT || 5000;

// FIX 2: This is the "Postman bridge" (Allows JSON data to be read)
app.use(express.json());

// Routes
const todoRoutes = require('./routes/to-do');
app.use('/api/todo', todoRoutes);

// Scrapbook Routes (Comment this out if it still says "Module Not Found")
//const scrapbookRoutes = require('./routes/scrapbook');
//app.use('/api/scrapbook', scrapbookRoutes);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// FIX 3: THE LISTENER (The server will stay open and wait for Postman)
app.listen(PORT, () => {
  console.log(`🚀 Server is officially running on port ${PORT}`);
  console.log(`Ready for Postman!`);
});
*/




