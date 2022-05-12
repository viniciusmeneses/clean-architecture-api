export class AdminAlreadyExistsError extends Error {
  public constructor(public email: string) {
    super(`Admin already exists with email ${email}`);
    this.name = "AdminAlreadyExistsError";
  }
}
