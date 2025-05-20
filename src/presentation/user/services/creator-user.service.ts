import { User } from '../../../data';

export class CreatorUserServise {
  async execute(data: any) {
    const user = new User();

    user.name = data.name.trim().toLowerCase();
    user.email = data.email.trim().toLowerCase();
    user.password = data.password.trim();
    try {
      await user.save();
      return user;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }
}
