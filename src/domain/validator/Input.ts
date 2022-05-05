export function Input(target: Object, propertyKey: string | symbol, inputIndex: number) {
  const existingValidatorInputs = Reflect.getMetadata("validator:inputs", target, propertyKey) || {};
  const inputTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);

  Reflect.defineMetadata(
    "validator:inputs",
    { ...existingValidatorInputs, [inputIndex]: inputTypes[inputIndex] },
    target,
    propertyKey
  );
}
