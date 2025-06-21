import { Request, Response } from 'express';
import { AuthService } from '../auth/services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      console.log('Request body:', req.body);
      console.log('Request headers:', req.headers);

      if (!req.body) {
        return res.status(400).json({
          message:
            'Request body is missing. Please send JSON data with Content-Type: application/json',
        });
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message:
            'Missing required fields: name, email, and password are required',
        });
      }

      const result = await this.authService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
