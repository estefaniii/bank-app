import { User } from '../../../data';

export class FinderUserService {
  async executeByFindAll() {
    const users = await User.find({
      select: ['id', 'name', 'email', 'role'],
      where: {
        status: true,
      },
    });
    return users;
  }

  async executeByFindOne(id: string) {
    const user = await User.findOne({
      where: {
        status: true,
        id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
