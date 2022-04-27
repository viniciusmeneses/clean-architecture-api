export class ValidationErrors extends Error {
  public constructor(public errors: string[]) {
    super(errors.toString());
    this.name = "ValidationErrors";
  }
}
