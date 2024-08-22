import dotenv from 'dotenv';
import http from 'http';
import { connectDB } from './config/database.js';
import { productRouter } from './routes/productRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { reportRouter } from './routes/reportRoutes.js';
import winston from 'winston';
import { authRouter } from './routes/authRoutes.js';
import { orderEmitter } from './controllers/orderController.js';

dotenv.config();

const port = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

let db;

const connectToDatabaseAndStartServer = async () => {
  db = await connectDB();

  const requestListener = async (req, res) => {
    if (req.url.startsWith('/cart')) {
      await cartRouter(req, res, db);
    } else if (req.url.startsWith('/orders')) {
      await orderRouter(req, res, db);
    } else if (req.url.startsWith('/products')) {
      await productRouter(req, res, db);
    } else if (req.url.startsWith('/auth')) {
      await authRouter(req, res, db);
    } else if (req.url.startsWith('/reports')) {
      await reportRouter(req, res, db);
    } 
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
  };

  const server = http.createServer(requestListener);

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  orderEmitter.on('orderPlaced', async (orderId, orderData) => {
    console.log(`Sipariş oluşturuldu: ${orderId}`);

    for (const item of orderData.cart) {
      const product = await db.collection('products').findOne({ _id: item.productId });
      if (product) {
        await db.collection('products').updateOne(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }
    }
    console.log(`Kullanıcıya bildirim gönderildi: ${orderData.userId}`);
  });

  orderEmitter.on('orderUpdated', (orderId, status) => {
    console.log(`Sipariş güncellendi: ${orderId}, Yeni Durum: ${status}`);

    if (status === 'Shipped') {
      console.log(`Sipariş teslim edildi ✅ : ${orderId}`);
    }
  });
};

connectToDatabaseAndStartServer();
