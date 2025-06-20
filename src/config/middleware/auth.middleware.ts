import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../envs';
import { UserRole } from '../../data/entities/user.entity'; // Asumiendo que tienes este enum

// Interface mejorada para el payload JWT
interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number; // issued at
  exp?: number; // expiration time
}

// Extensión de la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Constantes para mensajes de error
const AUTH_ERROR = 'Authentication required';
const INVALID_TOKEN = 'Invalid or expired token';
const INSUFFICIENT_PERMISSIONS = 'Insufficient permissions';

/**
 * Middleware de autenticación JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // Verificar formato del header
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: AUTH_ERROR,
        code: 'MISSING_AUTH_HEADER',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, envs.JWT_KEY) as JwtPayload;

    // Validaciones adicionales del payload
    if (!decoded.id || !decoded.email || !decoded.role) {
      return res.status(401).json({
        status: 'error',
        message: INVALID_TOKEN,
        code: 'INVALID_TOKEN_PAYLOAD',
      });
    }

    // Asignar usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Manejo específico de errores de JWT
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: INVALID_TOKEN,
        code: 'MALFORMED_TOKEN',
      });
    }

    // Error inesperado
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

/**
 * Middleware para verificación de roles
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: AUTH_ERROR,
          code: 'UNAUTHENTICATED',
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: INSUFFICIENT_PERMISSIONS,
          code: 'UNAUTHORIZED',
          requiredRoles: allowedRoles,
          userRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
};

/**
 * Middleware opcional para logs de autenticación
 */
export const authLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Auth attempt: ${req.method} ${req.path}`);
  next();
};
