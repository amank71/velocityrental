const crypto = require("crypto");

const KEY_LENGTH = 64;
const DEFAULT_COST = 16384;
const DEFAULT_BLOCK_SIZE = 8;
const DEFAULT_PARALLELIZATION = 1;

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(
      password,
      salt,
      KEY_LENGTH,
      {
        N: DEFAULT_COST,
        r: DEFAULT_BLOCK_SIZE,
        p: DEFAULT_PARALLELIZATION,
      },
      (error, key) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(
          [
            "scrypt",
            DEFAULT_COST,
            DEFAULT_BLOCK_SIZE,
            DEFAULT_PARALLELIZATION,
            salt,
            key.toString("hex"),
          ].join("$"),
        );
      },
    );
  });
}

function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    const [algorithm, cost, blockSize, parallelization, salt, expected] =
      String(storedHash || "").split("$");

    if (algorithm !== "scrypt" || !salt || !expected) {
      resolve(false);
      return;
    }

    crypto.scrypt(
      password,
      salt,
      Buffer.from(expected, "hex").length,
      {
        N: Number(cost),
        r: Number(blockSize),
        p: Number(parallelization),
      },
      (error, key) => {
        if (error) {
          reject(error);
          return;
        }

        const expectedBuffer = Buffer.from(expected, "hex");
        resolve(
          expectedBuffer.length === key.length &&
            crypto.timingSafeEqual(expectedBuffer, key),
        );
      },
    );
  });
}

module.exports = { hashPassword, verifyPassword };
