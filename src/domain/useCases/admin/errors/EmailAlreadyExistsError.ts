export class EmailAlreadyExistsError extends Error {
  public constructor(public email: string) {
    super(`Admin already exists with email ${email}`);
    this.name = "EmailAlreadyExistsError";
  }
}
