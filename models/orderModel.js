import { ObjectId } from 'mongodb';

export const createOrder = async (db, orderData) => {
  const result = await db.collection('orders').insertOne(orderData);
  return result.insertedId;
};

export const getOrderById = async (db, orderId) => {
  const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
  return order;
};

export const updateOrderStatus = async (db, orderId, status) => {
  const result = await db.collection('orders').updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status } }
  );
  return result.modifiedCount > 0;
};

export const getOrdersByUserId = async (db, userId) => {
  const orders = await db.collection('orders').find({ userId }).toArray();
  return orders;
};
