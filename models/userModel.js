import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export const createUser = async (db, userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const result = await db.collection('users').insertOne({
    username: userData.username,
    password: hashedPassword,
  });
  return result.insertedId;
};

export const findUserByUsername = async (db, username) => {
  return await db.collection('users').findOne({ username });
};
