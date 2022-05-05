import { validateOrReject } from "class-validator";

import { ValidationError } from "./errors";

export function ValidateInputs(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...inputs) {
    const validableInputs: { [key in string]: new () => unknown } = Reflect.getMetadata(
      "validator:inputs",
      target,
      propertyKey
    );

    if (validableInputs) {
      try {
        for (const [inputIndex, InputClass] of Object.entries(validableInputs)) {
          const instance = Object.assign(new InputClass(), inputs[inputIndex]);
          await validateOrReject(instance, {
            validationError: { target: false },
            forbidUnknownValues: true,
          });
        }
      } catch (errors) {
        throw new ValidationError(errors.flatMap((error) => Object.values(error.constraints ?? {})));
      }
    }

    return await method.apply(this, inputs);
  };

  return descriptor;
}
