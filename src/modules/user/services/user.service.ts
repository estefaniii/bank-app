import { Repository } from 'typeorm';
import { User, UserRole } from '../../../data/entities/user.entity';
import bcrypt from 'bcryptjs';
import { generateAccountNumber } from '../../../utils/generateAccountNumber';

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async registerUser(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      accountNumber: generateAccountNumber(),
      balance: 0,
      role: UserRole.CUSTOMER,
      isActive: true,
    });
    return await this.userRepository.save(user);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: string, updateData: Partial<User>) {
    const user = await this.getUserById(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    return await this.userRepository.remove(user);
  }
}
