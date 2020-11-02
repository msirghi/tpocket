import { sign } from 'jsonwebtoken';
import { User } from '../entity/User';
import { logger } from '../config/logger.config';
import { Response } from 'express';

const generateToken = (userId: number) => {
  try {
    const emailToken = sign(
      {
        user: userId
      },
      process.env.EMAIL_TOKEN_SECRET!,
      {
        expiresIn: '1d'
      }
    );
    return emailToken;
  } catch (e) {
    logger.error(e);
    throw Error(e);
  }
};

const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '7d'
  });
};

const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d'
    }
  );
};

const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, { httpOnly: true });
};

export default {
  generateToken,
  createAccessToken,
  createRefreshToken,
  sendRefreshToken
};
