import { Router } from 'express';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/services/auth.service';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const authService = new AuthService();
    const controller = new AuthController(authService);
    router.post('/register', controller.register.bind(controller));
    router.post('/login', controller.login.bind(controller));
    return router;
  }
}
