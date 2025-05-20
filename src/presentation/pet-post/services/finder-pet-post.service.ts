import { PetPost } from '../../../data';
import { PetPostStatus } from '../enums/pet-post-status.enum';

export class FinderPetPostService {
  // Fixed class name (Port -> Post)
  async executeByFindAll() {
    return await PetPost.find({
      where: {
        status: PetPostStatus.APPROVED,
        hasFound: false,
      },
      order: {
        createdAt: 'DESC', // Added sorting by creation date
      },
    });
  }

  async executeByFindOne(id: string) {
    const petPost = await PetPost.findOne({
      where: {
        id: id,
        status: PetPostStatus.APPROVED, // Added status filter for consistency
      },
      relations: ['owner'], // Example of eager loading relations
    });

    if (!petPost) {
      throw new Error('Pet post not found');
    }
    return petPost;
  }
}
