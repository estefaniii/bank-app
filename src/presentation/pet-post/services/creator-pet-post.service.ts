import { PetPost } from '../entities/pet-post.entity';
import { PetPostStatus } from '../enums/pet-post-status.enum';

interface CreatePetPostDto {
  petName: string;
  description: string;
  image_url: string;
  ownerId?: string;
}

export class CreatorPetPostService {
  async execute(data: CreatePetPostDto) {
    // Input validation
    if (!data.petName || !data.description || !data.image_url) {
      throw new Error('Missing required fields');
    }

    if (data.petName.length > 60) {
      throw new Error('Pet name must be 60 characters or less');
    }

    const petPost = new PetPost();
    petPost.petName = data.petName.trim();
    petPost.description = data.description.trim();
    petPost.image_url = data.image_url.trim();
    petPost.status = PetPostStatus.PENDING; // Default status

    if (data.ownerId) {
      petPost.ownerId = data.ownerId;
    }

    try {
      const savedPost = await petPost.save();

      // Return without sensitive data if needed
      return {
        id: savedPost.id,
        petName: savedPost.petName,
        description: savedPost.description,
        image_url: savedPost.image_url,
        status: savedPost.status,
        createdAt: savedPost.createdAt,
      };
    } catch (error) {
      console.error('Error creating pet post:', error);

      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new Error('Pet post with similar details already exists');
      }

      throw new Error('Failed to create pet post');
    }
  }
}
