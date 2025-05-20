import { PetPostStatus } from '../entities/pet-post.entity';
import { FinderPetPostService } from './finder-pet-post.service';

export class RejectPetPostService {
  constructor(private readonly finderPetPostService: FinderPetPostService) {}

  async execute(id: string) {
    const petPost = await this.finderPetPostService.executeByFindOne(id);

    if (petPost.status === PetPostStatus.REJECTED) {
      return {
        message: 'Pet post already rejected',
        petPost,
      };
    }

    petPost.status = PetPostStatus.REJECTED;

    try {
      await petPost.save();
      return {
        message: 'Pet post rejected successfully',
        petPost,
      };
    } catch (error) {
      console.error('Error rejecting pet post:', error);
      throw new Error('Error rejecting pet post');
    }
  }
}
