import { getCart, addToCart, removeFromCart, clearCart, calculateTotal } from '../models/cartModel.js';
import { getProductById } from './productController.js';

export const viewCart = (userId) => {
  return getCart(userId);
};

export const addItemToCart = async (db, userId, productId) => {
  const product = await getProductById(db, productId);
  if (product) {
    addToCart(userId, product);
    return true;
  }
  return false;
};

export const removeItemFromCart = (userId, productId) => {
  removeFromCart(userId, productId);
};

export const clearUserCart = (userId) => {
  clearCart(userId);
};

export const getTotalPrice = (userId) => {
  return calculateTotal(userId);
};
