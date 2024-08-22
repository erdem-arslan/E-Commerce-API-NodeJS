import { ObjectId } from 'mongodb';


export const getProducts = async (db) => {
    const products = await db.collection('products').find({}).toArray();
    return products;
};


export const getProductById = async (db, id) => {
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    return product;
};


export const createProduct = async (db, productData) => {
    const result = await db.collection('products').insertOne(productData);
    return result.insertedId;
};


export const updateProduct = async (db, id, updateData) => {
    const result = await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return result.modifiedCount > 0;
};


export const deleteProduct = async (db, id) => {
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  };
