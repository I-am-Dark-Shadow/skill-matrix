import app from './src/app.js';
import connectDB from './src/config/db.js';
import 'dotenv/config';

const PORT = process.env.PORT || 8000;

// Connect to the database and then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the database!', err);
    process.exit(1);
  });