import { viewCart, addItemToCart, removeItemFromCart, clearUserCart, getTotalPrice } from '../controllers/cartController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

export const cartRouter = async (req, res, db) => {
  if (req.url === '/cart' && req.method === 'GET') {
    authenticateJWT(req, res, async () => {
      const cart = viewCart(req.user.id); 
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cart));
    });
  } else if (req.url.startsWith('/cart/') && req.method === 'POST') {
    authenticateJWT(req, res, async () => {
      const productId = req.url.split('/')[2];
      const added = await addItemToCart(db, req.user.id, productId);
      if (added) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product added to cart' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product not found' }));
      }
    });
  } else if (req.url.startsWith('/cart/') && req.method === 'DELETE') {
    authenticateJWT(req, res, async () => {
      const productId = req.url.split('/')[2];
      removeItemFromCart(req.user.id, productId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product removed from cart' }));
    });
  } else if (req.url === '/cart/clear' && req.method === 'DELETE') {
    authenticateJWT(req, res, async () => {
      clearUserCart(req.user.id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Cart cleared' }));
    });
  } else if (req.url === '/cart/total' && req.method === 'GET') {
    authenticateJWT(req, res, async () => {
      const total = getTotalPrice(req.user.id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ total }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
};
