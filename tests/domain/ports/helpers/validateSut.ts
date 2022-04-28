import { validate } from "class-validator";

export const validateSut = (sut: object) => validate(sut, { skipUndefinedProperties: true });
