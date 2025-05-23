import { User } from '../../../data';

export class FinderUserService {
  async executeByFindAll() {
    const users = await User.find({
      select: ['id', 'name', 'email', 'role'],
      where: {
        status: false,
      },
    });
    return users;
  }

  async executeByFindOne(id: string) {
    const user = await User.findOne({
      where: {
        status: false,
        id,
      },
    });

    if (!user) {
      return 'User not found';
    }
    return user;
  }
}
