import { Router } from 'express';
import { UserController } from './user.controller';
import { CreatorUserService } from './services/creator-user.service';
import { LoginUserService } from './services/login-user.service';
import { FinderUserService } from './services/finder-user.service';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    // Initialize services
    const creatorUserService = new CreatorUserService();
    const loginUserService = new LoginUserService();
    const finderUserService = new FinderUserService();

    // Create controller with dependencies
    const controller = new UserController(
      creatorUserService,
      loginUserService,
      finderUserService,
    );

    // Define routes
    router.get('/', controller.findAll);
    router.post('/register', controller.register);
    router.post('/login', controller.login);
    router.get('/:id', controller.findOne);

    return router;
  }
}
