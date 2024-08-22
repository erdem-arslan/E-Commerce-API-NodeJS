import { getTopSellingProducts } from '../controllers/reportController.js';

export const reportRouter = async (req, res, db) => {
  if (req.url === '/reports/top-products' && req.method === 'GET') {
    const topProducts = await getTopSellingProducts(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(topProducts));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
};
