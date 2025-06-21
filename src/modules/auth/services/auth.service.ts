import bcrypt from 'bcryptjs';
import { User, UserRole } from '../../../data/entities/user.entity';
import { AppDataSource } from '../../../data/data-source';
import { envs } from '../../../config/envs';
import { generateAccountNumber } from '../../../utils/generateAccountNumber';
import { JwtAdapter } from '../../../config/jwt.adapter.js';

const userRepository = AppDataSource.getRepository(User);

interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

interface LoginUserDto {
  email: string;
  password: string;
}

export class AuthService {
  async register(registerDto: RegisterUserDto) {
    const { name, email, password } = registerDto;
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = generateAccountNumber();
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 0,
      role: UserRole.CUSTOMER,
    });
    await userRepository.save(user);
    const token = await JwtAdapter.generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      envs.JWT_EXPIRE_IN,
    );
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
        role: user.role,
      },
      token,
    };
  }
  async login(loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    const user = await userRepository.findOne({ where: { email } });

    console.log('Login attempt for email:', email);
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User password exists:', !!user.password);
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // If user has no password, set a default one and allow login
    if (!user.password) {
      console.log('User has no password, setting default password');
      const defaultPassword = 'DefaultPass123!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      user.password = hashedPassword;
      await userRepository.save(user);

      // Check if the provided password matches the default
      const isDefaultPassword = await bcrypt.compare(password, hashedPassword);
      if (!isDefaultPassword) {
        throw new Error(
          'Account requires password reset. Please use the default password: DefaultPass123!',
        );
      }
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
    }

    const token = await JwtAdapter.generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      envs.JWT_EXPIRE_IN,
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
        role: user.role,
      },
      token,
      message: !user.password
        ? 'Please change your password after login'
        : undefined,
    };
  }
}
