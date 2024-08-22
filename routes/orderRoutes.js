import { placeOrder, getOrder, updateOrder, getUserOrders } from '../controllers/orderController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { viewCart } from '../controllers/cartController.js';  

export const orderRouter = async (req, res, db) => {
  if (req.url === '/orders' && req.method === 'POST') {
    authenticateJWT(req, res, async () => {
      try {

        const cart = viewCart(req.user.id);
        
        if (!cart || cart.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Cart is empty' }));
          return;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderId = await placeOrder(db, req.user.id, cart, total);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Order placed', orderId }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error placing order', error: error.message }));
      }
    });
  } else if (req.url.startsWith('/orders/') && req.method === 'GET') {
    authenticateJWT(req, res, async () => {
      try {
        const orderId = req.url.split('/')[2];
        const order = await getOrder(db, orderId);
        if (order) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(order));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Order not found' }));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error fetching order', error: error.message }));
      }
    });
  } else if (req.url.startsWith('/orders/') && req.method === 'PUT') {
    authenticateJWT(req, res, async () => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const orderId = req.url.split('/')[2];
          const { status } = JSON.parse(body);

          const updated = await updateOrder(db, orderId, status);
          if (updated) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order updated' }));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order not found' }));
          }
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Error updating order', error: error.message }));
        }
      });
    });
  } else if (req.url === '/orders' && req.method === 'GET') {
    authenticateJWT(req, res, async () => {
      try {
        const orders = await getUserOrders(db, req.user.id); 
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orders));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error fetching orders', error: error.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
};

