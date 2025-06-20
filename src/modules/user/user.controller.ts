import { Request, Response } from 'express';
import { UserService } from './services/user.service';
import { User } from '../../data/entities/user.entity';

interface CustomRequest extends Request {
  user?: User;
}

export class UserController {
  constructor(private readonly userService: UserService) {}

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await this.userService.registerUser(name, email, password);

      // Excluir la contraseña en la respuesta
      const userObj = { ...(user as any) };
      delete userObj.password;
      res.status(201).json({
        success: true,
        data: userObj,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      // La lógica de login debería estar en AuthService
      // Esta es solo una implementación básica
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProfile(req: CustomRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await this.userService.getUserById(userId);

      const { password: _, ...userData } = user;

      res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req: CustomRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const updatedUser = await this.userService.updateUser(userId, req.body);

      const { password: _, ...userData } = updatedUser;

      res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users.map((user: any) => {
          const { password, ...userData } = user;
          return userData;
        }),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      const { password: _, ...userData } = user;
      res.status(200).json({ success: true, data: userData });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body,
      );
      const { password: _, ...userData } = updatedUser;
      res.status(200).json({ success: true, data: userData });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
