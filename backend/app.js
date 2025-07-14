const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// connection with database

require('./connection/conn');

const app = express();

// cross origin policy

const corsOptions = {
  origin: '*',
  // origin: 'http://localhost:5173', 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'bookid', 'userid', 'orderid']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(bodyParser.json());
app.use(express.json());

//authentication
app.use('/api/auth', require('./routes/auth/authRoutes'))

//user routes

app.use("/api/user", require('./routes/user/userRoutes'));
app.use("/api/books", require('./routes/user/bookRoutes'));
app.use("/api/favourite", require('./routes/user/favouriteRoutes'));
app.use("/api/cart", require('./routes/user/cartRoutes'));
app.use("/api/order", require('./routes/user/orderRoutes'));
app.use("/api/reviews", require('./routes/user/ratingRoutes'))
app.use("/api/category",require('./routes/user/categoryRoutes'))
// admin routess

app.use("/api/admin/order", require('./routes/admin/orderRoutes'))
app.use("/api/admin/books", require('./routes/admin/bookRoutes'))
app.use("/api/admin/user", require('./routes/admin/userRoutes'))
app.use("/api/admin/inventory", require('./routes/admin/inventoryRoutes'))
app.use("/api/admin/category",require('./routes/admin/categoryRoutes'))
app.use('/api/admin/analytics', require('./routes/admin/analyticsRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
