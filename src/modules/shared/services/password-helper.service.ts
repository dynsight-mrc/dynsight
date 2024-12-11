import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordServiceHelper {
  constructor() {}
   createPasswordHash = async(password: string): Promise<string>=> {
    const saltRounds = 10;

    let hash = bcrypt.hash(password, saltRounds);
    return hash;
  }
  async checkPasswordHash(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    let check = await bcrypt.compare(password, hashedPassword);
    return check;
  }
}
