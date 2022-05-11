import { Http } from "@presentation/protocols";

export class HttpResponse {
  public static created(data: any): Http.Response {
    return {
      status: 201,
      body: data,
    };
  }

  public static badRequest(error: Error | Error[]): Http.Response {
    const errors = error instanceof Error ? [error] : error;

    return {
      status: 400,
      body: { errors: errors.map(({ name, message }) => ({ type: name, message })) },
    };
  }
}
