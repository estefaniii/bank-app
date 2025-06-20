export declare class JwtAdapter {
  static generateToken(payload: any, duration?: string): Promise<string | null>;
  static validateToken(token: string): Promise<any | null>;
}
