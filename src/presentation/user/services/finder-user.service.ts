import { User } from "../../../data";

export class FinderUserService {
  async executeByFindAll() {}
    return await User.find({
      select: ['id', 'name', 'email', 'rol'],
      where: {
        status: true,
      }
    });
}

  async executeByFindOne(id: string) {
    const user = await User.findOne({
      where: {
        status: true,
        id,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }
   return user;
  }
  }