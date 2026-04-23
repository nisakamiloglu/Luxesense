const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const liraRoutes = require('./routes/lira.routes');
const { startDecayJob } = require('./services/DecayJob');
const { getBrands, getCategories } = require('./controllers/product.controller');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/lira', liraRoutes);

startDecayJob();
app.get('/api/brands', getBrands);
app.get('/api/categories', getCategories);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LuxeSense API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
