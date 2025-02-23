import jwt from 'jsonwebtoken';
import { DecodedToken } from './types';
const secret = process.env.JWT_SECRET as string;

export const generateToken = (user: any) => {
  const item: DecodedToken = {
    id: user.id,
    email: user.emails[0].value,
    name: user.displayName,
    picture: user.photos[0].value,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    role: 'user', // logic added later
  }
  const token = jwt.sign({ item }, secret, { expiresIn: '24h' }); // change to smaller once in production
  return token;
};

export const verifyToken = (token: string): DecodedToken => {
  const decodedToken = jwt.verify(token, secret) as DecodedToken;
  return decodedToken;
};


