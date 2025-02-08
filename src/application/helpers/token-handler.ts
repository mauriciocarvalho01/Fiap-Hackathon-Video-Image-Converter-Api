import { TokenValidator } from '@/domain/contracts/application';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class TokenHandler implements TokenValidator {
  constructor(private readonly secret?: string) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Nível de segurança (quanto maior, mais lento)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }

  generateUuid(): string {
    return uuidv4();
  }

  async validateJwt({
    token,
  }: TokenValidator.Input): Promise<TokenValidator.GenericType> {
    const payload = verify(token, this.secret ?? 'any_secret') as JwtPayload;
    return payload;
  }

  generateJwt(payload: object, expiresIn: string | number): string {
    if (!this.secret) {
      throw new Error('Secret key is not defined.');
    }
    return sign(payload, this.secret, { expiresIn });
  }
}
