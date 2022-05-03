import bcrypt from "bcrypt";

import faker from "@faker-js/faker";
import { BcryptAdapter } from "@infra/crypt/BcryptAdapter";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hash"),
}));

interface SutTypes {
  salt: number;
  sut: BcryptAdapter;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return { sut, salt };
};

describe("BcryptAdapter", () => {
  describe("encrypt", () => {
    it("Should call Bcrypt.hash with text and salt", async () => {
      const { sut, salt } = makeSut();
      const text = faker.random.word();

      await sut.encrypt(text);

      expect(bcrypt.hash).toBeCalledTimes(1);
      expect(bcrypt.hash).toBeCalledWith(text, salt);
    });

    it("Should throw if Bcrypt.hash throws", async () => {
      const { sut } = makeSut();
      const text = faker.random.word();

      jest.mocked(bcrypt.hash).mockImplementationOnce(async () => {
        throw new Error();
      });

      expect(sut.encrypt(text)).rejects.toThrow();
    });

    it("Should return a hash on success", async () => {
      const { sut } = makeSut();
      const text = faker.random.word();

      const hash = await sut.encrypt(text);
      expect(hash).toBe("hash");
    });
  });
});
