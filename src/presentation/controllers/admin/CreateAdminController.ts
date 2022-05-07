import { CreateAdminUseCase } from "@domain/ports/useCases/admin";
import { EmailAlreadyExistsError } from "@domain/useCases/admin";
import { ValidationErrors } from "@domain/validator";
import { HttpResponse } from "@presentation/helpers";
import { Controller, Http } from "@presentation/protocols";

export class CreateAdminController implements Controller {
  public constructor(private createAdminUseCase: CreateAdminUseCase) {}

  public async handle(request: CreateAdminController.Request): Promise<Http.Response> {
    const { email, password } = request.body;

    try {
      const admin = await this.createAdminUseCase.execute({ email, password });
      return HttpResponse.created(admin);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: Error): Http.Response {
    if (error instanceof ValidationErrors) return HttpResponse.badRequest(error.errors);
    if (error instanceof EmailAlreadyExistsError) return HttpResponse.badRequest(error);
    return HttpResponse.serverError(error);
  }
}

export namespace CreateAdminController {
  interface RequestBody {
    email: string;
    password: string;
  }

  export type Request = Http.Request<RequestBody>;
}
