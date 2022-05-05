import { validateOrReject } from "class-validator";

import { ValidationError } from "./errors";

export function ValidateInputs(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...inputs) {
    const inputTypes: any[] = Reflect.getMetadata("design:paramtypes", target, propertyKey);

    try {
      const validationPromises = inputTypes.map((Type, index) => {
        if (!Type.toString().startsWith(`class `)) return Promise.resolve();

        const instance = Object.assign(new Type(), inputs[index]);
        return validateOrReject(instance, {
          validationError: { target: false },
          forbidUnknownValues: true,
        });
      });

      await Promise.all(validationPromises);
    } catch (errors) {
      throw new ValidationError(errors.flatMap((error) => Object.values(error.constraints ?? {})));
    }

    return await method.apply(this, inputs);
  };

  return descriptor;
}
