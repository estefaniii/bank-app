import { Router } from 'express';
import { UserRoutes } from './user/routes';
import { PetPostRoutes } from './pet-post/router';

export class AppRoutes {
  static get routes() {
    const router = Router();

    router.use('/api/users', UserRoutes.routes);
    router.use('/api/pet-posts', PetPostRoutes.routes);

    return router;
  }
}
