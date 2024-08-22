import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../models/userModel.js';
import bcrypt from 'bcrypt';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';


export const registerUser = async (db, userData) => {
  const user = await findUserByUsername(db, userData.username);
  if (user) {
    throw new Error('User already exists');
  }

  const userId = await createUser(db, userData);
  return userId;
};


export const loginUser = async (db, username, password) => {
  const user = await findUserByUsername(db, username);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }


  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
  return token;
};
