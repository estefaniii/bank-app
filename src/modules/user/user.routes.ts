import { Router } from 'express';
import { AppDataSource } from '../../data/data-source';
import { User } from '../../data/entities/user.entity';
import { UserController } from '../user/user.controller';
import {
  authenticate,
  checkRole,
} from '../../config/middleware/auth.middleware';
import { UserRole } from '../../data/entities/user.entity';
import { UserService } from '../user/services/user.service';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userRepository = AppDataSource.getRepository(User);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    router.post('/register', userController.register.bind(userController));
    router.post('/login', userController.login.bind(userController));
    router.use(authenticate as any);
    router.get(
      '/profile',
      userController.getProfile.bind(userController) as any,
    );
    router.put(
      '/profile',
      userController.updateProfile.bind(userController) as any,
    );
    router.use(checkRole([UserRole.ADMIN]) as any);
    router.get('/', userController.getAllUsers.bind(userController));
    router.get(
      '/:id',
      userController.getUserById.bind(
        userController,
      ) as import('express').RequestHandler,
    );
    router.put('/:id', userController.updateUser.bind(userController));
    router.delete('/:id', userController.deleteUser.bind(userController));

    return router;
  }
}
