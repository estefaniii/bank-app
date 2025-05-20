import { Request, Response } from 'express';
import { CreatorPetPostService } from './services/creator-pet-post.service';
import { FinderPetPostService } from './services/finder-pet-post.service';
import { RejectPetPostService } from './services/reject-pet-post.service';
import { ApproverPetPostService } from './services/approve-pet-post.service';

export class PetPostController {
  constructor(
    private readonly creatorPetPostService: CreatorPetPostService,
    private readonly finderPetPostService: FinderPetPostService,
    private readonly approvePetPostService: ApproverPetPostService,
    private readonly rejectPetPostService: RejectPetPostService,
  ) { }

  create = (req: Request, res: Response) => {
    this.creatorPetPostService
      .execute(req.body)
      .then((petPost) => res.status(201).json(petPost))
      .catch((error) =>
        res.status(500).json({ message: 'Internal server error' }),
      );
  };

  findAll = (req: Request, res: Response) => {
    this.finderPetPostService
      .executeByFindAll()
      .then((petPosts) => res.status(200).json(petPosts))
      .catch((error) =>
        res.status(500).json({ message: 'Internal server error' }),
      );
  };

  findOne = (req: Request, res: Response) => {
    const { id } = req.params;
    this.finderPetPostService
      .executeByFindOne(id)
      .then((petPost) => res.status(200).json(petPost))
      .catch((error) =>
        res.status(500).json({ message: 'Internal server error' }),
      );
  };

  approve = (req: Request, res: Response) => {
    const { id } = req.params;
    this.approvePetPostService
      .execute(id)
      .then((result) => res.status(200).json(result))
      .catch((error) =>
        res.status(500).json({ message: 'Internal server error' }),
      );
  };

  reject = (req: Request, res: Response) => {
    const { id } = req.params;
    this.rejectPetPostService
      .execute(id)
      .then((result) => res.status(200).json(result))
      .catch((error) =>
        res.status(500).json({ message: 'Internal server error' }),
      );
  };
}
