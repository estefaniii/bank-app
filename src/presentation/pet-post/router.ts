import { Router } from 'express';
import { CreatorPetPostService } from './services/creator-pet-post.service';
import { FinderPetPostService } from './services/finder-pet-post.service';
import { ApproverPetPostService } from './services/approve-pet-post.service';
import { RejectPetPostService } from './services/reject-pet-post.service';
import { PetPostController } from './controller';

export class PetPostRoutes {
  static get routes(): Router {
    const router = Router();

    // Initialize services
    const finderPetPostService = new FinderPetPostService();
    const creatorPetPostService = new CreatorPetPostService();
    const approvePetPostService = new ApproverPetPostService(
      finderPetPostService,
    );
    const rejectPetPostService = new RejectPetPostService(finderPetPostService);

    // Create controller with all dependencies
    const controller = new PetPostController(
      creatorPetPostService,
      finderPetPostService,
      approvePetPostService,
      rejectPetPostService,
    );

    // Define routes
    router.post('/', controller.create);
    router.get('/', controller.findAll);
    router.get('/:id', controller.findOne);
    router.patch('/:id/approve', controller.approve); // Changed from GET to PATCH for semantic correctness
    router.patch('/:id/reject', controller.reject);

    return router;
  }
}
