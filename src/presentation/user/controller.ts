import { Request, Response } from 'express';
import { LoginUserService } from './services/login-user.service';
import { FinderUserService } from './services/finder-user.service';
import { CreatorUserServise } from '../user/services/creator-user.service';

export class UserController {
  constructor(
    private readonly creatorUserService: CreatorUserServise,
    private readonly loginUserService: LoginUserService,
    private readonly finderUserService: FinderUserService,
  ) {}

  register = (req: Request, res: Response) => {
    this.creatorUserService
      .execute(req.body)
      .then((data) => res.status(201).json(data))
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error' });
      });
  };

  login = (req: Request, res: Response) => {
    this.loginUserService
      .execute()
      .then((data) => res.status(200).json(data))
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error' });
      });
  };

  findAll = (req: Request, res: Response) => {
    this.finderUserService
      .executeByFindAll()
      .then((data) => res.status(200).json(data))
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error' });
      });
  };

  findOne = (req: Request, res: Response) => {
    const { id } = req.params;

    this.finderUserService
      .executeByFindOne(id)
      .then((data) => res.status(200).json(data))
      .catch((error) => {
        console.log('ERROR en findOne - Mensaje:', error.message);
        res.status(500).json({ message: 'Internal server error' });
      });
  };
}
