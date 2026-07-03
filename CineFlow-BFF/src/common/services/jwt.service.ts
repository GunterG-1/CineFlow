import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  constructor() {
  const secret = process.env.JWT_SECRET;
  console.log('DEBUG JWT_SECRET:', secret);
  console.log('DEBUG cwd:', process.cwd()); // ← temporal

  if (!secret) {
    throw new Error('JWT_SECRET es obligatorio para iniciar el BFF');
  }

  this.secret = secret;
}

  generateToken(userId: number, email: string): string {
    const payload = { userId, email };
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn']
    });
  }

  verifyToken(token: string): { userId: number; email: string } {
    try {
      return jwt.verify(token, this.secret) as any;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
