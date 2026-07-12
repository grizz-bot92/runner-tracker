import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request{
  user?: any;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secret = process.env.SECRET;

  if(!secret){
    return res.status(500).json({ error: 'missing JWT secret' });
  }

  if(!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    
    next();
  } catch(err) {
    return res.status(403).json({
      message: 'Invalid or expired token',
    });
  }
}

export default authenticate;