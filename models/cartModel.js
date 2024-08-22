import { ObjectId } from 'mongodb';

let carts = {}; 

export const getCart = (userId) => {
  if (!carts[userId]) {
    carts[userId] = [];
  }
  return carts[userId];
};

export const addToCart = (userId, product) => {
  if (!carts[userId]) {
    carts[userId] = [];
  }
  carts[userId].push(product);
};

export const removeFromCart = (userId, productId) => {
  if (!carts[userId]) return;
  carts[userId] = carts[userId].filter(product => product._id.toString() !== new ObjectId(productId).toString());
};

export const clearCart = (userId) => {
  carts[userId] = [];
};

export const calculateTotal = (userId) => {
  if (!carts[userId]) return 0;
  return carts[userId].reduce((total, product) => total + product.price, 0);
};
