import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

export const productRouter = async (req, res, db) => {
  const query = new URLSearchParams(req.url.split('?')[1]);

  if (req.method === 'GET') {

    if (req.url.match(/^\/products\/[a-zA-Z0-9]+$/)) {
      const id = req.url.split('/')[2];
      const product = await getProductById(db, id);
      if (product) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(product));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product not found' }));
      }
    } 

    else if (req.url.startsWith('/products')) {
      const filter = {};


      if (query.has('name')) {
        filter.name = { $regex: query.get('name'), $options: 'i' }; 
      }


      if (query.has('minPrice')) {
        filter.price = { $gte: parseFloat(query.get('minPrice')) };
      }
      if (query.has('maxPrice')) {
        filter.price = filter.price || {};
        filter.price.$lte = parseFloat(query.get('maxPrice'));
      }


      if (query.has('inStock')) {
        filter.stock = query.get('inStock') === 'true' ? { $gt: 0 } : { $eq: 0 };
      }


      const page = parseInt(query.get('page')) || 1;
      const limit = parseInt(query.get('limit')) || 10;
      const skip = (page - 1) * limit;


      const totalProducts = await db.collection('products').countDocuments(filter);


      const products = await db.collection('products')
        .find(filter)
        .skip(skip)
        .limit(limit)
        .toArray();


      const totalPages = Math.ceil(totalProducts / limit);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        page,
        totalPages,
        totalProducts,
        products
      }));
    }
  } else if (req.url === '/products' && req.method === 'POST') {
    authenticateJWT(req, res, async () => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        const productData = JSON.parse(body);
        const productId = await createProduct(db, productData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product created', productId }));
      });
    });
  } else if (req.url.startsWith('/products/') && req.method === 'PUT') {
    authenticateJWT(req, res, async () => {
      const id = req.url.split('/')[2];
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        const updateData = JSON.parse(body);
        const updated = await updateProduct(db, id, updateData);
        if (updated) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Product updated' }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Product not found' }));
        }
      });
    });
  } else if (req.url.startsWith('/products/') && req.method === 'DELETE') {
    authenticateJWT(req, res, async () => {
      const id = req.url.split('/')[2];
      const deleted = await deleteProduct(db, id);
      if (deleted) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product deleted' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product not found' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
};
