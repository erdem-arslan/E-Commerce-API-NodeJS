import { createOrder, getOrderById, updateOrderStatus, getOrdersByUserId } from '../models/orderModel.js';
import EventEmitter from 'events';

export const orderEmitter = new EventEmitter();

export const placeOrder = async (db, userId, cart, total) => {
  if (!cart || cart.length === 0) {
    throw new Error('Cart is empty');
  }

  const orderData = {
    userId,
    cart,
    total,
    status: 'Pending',
    createdAt: new Date(),
  };

  const result = await db.collection('orders').insertOne(orderData);
  const orderId = result.insertedId;


  orderEmitter.emit('orderPlaced', orderId, orderData);

  return orderId;
};

export const getOrder = async (db, orderId) => {
  return await getOrderById(db, orderId);
};

export const updateOrder = async (db, orderId, status) => {
  const updated = await updateOrderStatus(db, orderId, status);
  if (updated) {
    orderEmitter.emit('orderUpdated', orderId, status);
  }
  return updated;
};

export const getUserOrders = async (db, userId) => {
  return await getOrdersByUserId(db, userId);
};
