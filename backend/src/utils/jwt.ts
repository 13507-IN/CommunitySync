import jwt from 'jsonwebtoken';
import { getConfig } from '../config/index.js';
import type { User } from '../db/schema/users.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RefreshPayload {
  userId: string;
  tokenVersion: number;
}

function requireSecret(secret: string | undefined, name: string): string {
  if (!secret) {
    throw new Error(`${name} is not configured`);
  }

  return secret;
}

export function generateAccessToken(user: User): string {
  const config = getConfig();
  const secret = requireSecret(config.JWT_SECRET, 'JWT_SECRET');
  
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secret, {
    expiresIn: config.JWT_EXPIRY as jwt.SignOptions['expiresIn'],
  });
}

export function generateRefreshToken(user: User, tokenVersion: number = 1): string {
  const config = getConfig();
  const secret = requireSecret(config.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET');
  
  const payload: RefreshPayload = {
    userId: user.id,
    tokenVersion,
  };

  return jwt.sign(payload, secret, {
    expiresIn: config.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  const config = getConfig();
  const secret = requireSecret(config.JWT_SECRET, 'JWT_SECRET');
  
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string') {
      return null;
    }

    return decoded as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshPayload | null {
  const config = getConfig();
  const secret = requireSecret(config.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET');
  
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string') {
      return null;
    }

    return decoded as unknown as RefreshPayload;
  } catch {
    return null;
  }
}
