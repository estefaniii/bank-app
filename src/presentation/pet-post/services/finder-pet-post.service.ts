import { PetPost, PetPostStatus } from '../../../data';

export class FinderPetPostService {
  async executeByFindAll() {
    return await PetPost.find({
      where: {
        //status: PetPostStatus.APPROVED,
        //hasFound: false,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async executeByFindOne(id: string) {
    const petPost = await PetPost.findOne({
      where: {
        id: id,
        //status: PetPostStatus.APPROVED,
      },
      //relations: ['owner'],
    });

    if (!petPost) {
      throw new Error('Pet post not found');
    }
    return petPost;
  }
}
