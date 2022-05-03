import { hash } from "bcrypt";

import { Encrypter } from "@domain/ports/crypt/Encrypter";

export class BcryptAdapter implements Encrypter {
  public constructor(private salt: number) {}

  public encrypt(text: string): Promise<string> {
    return hash(text, this.salt);
  }
}
