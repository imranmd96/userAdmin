import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, RequestHandler, Response, NextFunction } from 'express'


export const createToken = (
    data: Record<string, any>,
    key: string,
    expiresIn: string
  ) => {
    return jwt.sign({ ...data }, String(key), { expiresIn: '10m' })
  }


export const verifyToken = (
  res: Response,
  token: string,
  key: string
): string | JwtPayload => {
  try {
    return jwt.verify(token, String(key))
  } catch (error) {
    return res.json()
  }
}