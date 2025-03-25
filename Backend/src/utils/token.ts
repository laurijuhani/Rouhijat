import jwt from 'jsonwebtoken';
import { Data, DecodedToken, Role, GoogleUser } from './types';
import prisma from './client';
const secret = process.env.JWT_SECRET as string;



export const generateToken = async (user: GoogleUser) => {  
  const res = await prisma.user.findUnique({
    where: {
      email: user.emails[0].value
    },
    select: {
      role: true
    }
  }); 

  if (!res) {
    return '';
  }

  const role = res.role as Role;
    
  const item: DecodedToken = {
    id: user.id,
    email: user.emails[0].value,
    name: user.displayName,
    picture: user.photos[0].value,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    role,
  }; 
  const token = jwt.sign({ item }, secret, { expiresIn: '24h' }); // change to smaller once in production
  return token;
};

export const verifyToken = (token: string): Data => {
  const decodedToken = jwt.verify(token, secret) as Data;
  return decodedToken;
};


