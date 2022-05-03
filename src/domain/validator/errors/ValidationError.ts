export class ValidationError extends Error {
  public constructor(public messages: string[]) {
    super(messages.toString());
    this.name = "ValidationError";
  }
}
