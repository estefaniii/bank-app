import { PetPost } from '../../../data';

export class CreatorPetPostService {
  async execute(data: any) {
    const petPost = new PetPost();

    petPost.petName = data.petName.trim();
    petPost.description = data.description.trim();
    petPost.image_url = data.image_url.trim();
    petPost.status = data.status;

    try {
      return await petPost.save();
    } catch (error) {
      throw new Error('Error creating pet post');
    }
  }
}
