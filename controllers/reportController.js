export const getTopSellingProducts = async (db) => {

  const topProducts = await db.collection('orders').aggregate([
    { $unwind: '$cart' },
    { $group: { _id: '$cart._id', totalSold: { $sum: 1 } } },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    { $unwind: '$productDetails' },
    {
      $project: {
        _id: 1,
        name: '$productDetails.name',
        price: '$productDetails.price',
        totalSold: 1
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]).toArray();


  if (topProducts.length === 0) {
    return await db.collection('products').find({}).limit(5).toArray();
  }

  return topProducts;
};
