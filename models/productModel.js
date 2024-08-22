export const createProduct = async (db, product) => {
    const result = await db.collection('products').insertOne(product);
    return result.insertedId;
  };
