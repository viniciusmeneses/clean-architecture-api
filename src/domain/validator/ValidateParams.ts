import { validateOrReject } from "class-validator";

import { ValidationErrors } from "./ValidationErrors";

export function ValidateParams(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...params) {
    const validableParams: { [key in string]: new () => unknown } = Reflect.getMetadata(
      "validator:params",
      target,
      propertyKey
    );

    if (validableParams) {
      try {
        for (const [paramIndex, ParamClass] of Object.entries(validableParams)) {
          const instance = Object.assign(new ParamClass(), params[paramIndex]);
          await validateOrReject(instance, {
            validationError: { target: false },
            forbidUnknownValues: true,
          });
        }
      } catch (errors) {
        throw new ValidationErrors(errors.flatMap((error) => Object.values(error.constraints ?? {})));
      }
    }

    return await method.apply(this, params);
  };

  return descriptor;
}
