export function Param(target: Object, propertyKey: string | symbol, paramIndex: number) {
  const existingValidatorParams = Reflect.getMetadata("validator:params", target, propertyKey) || {};
  const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);

  Reflect.defineMetadata(
    "validator:params",
    { ...existingValidatorParams, [paramIndex]: paramTypes[paramIndex] },
    target,
    propertyKey
  );
}
