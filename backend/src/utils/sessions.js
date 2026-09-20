const crypto = require("crypto");

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function base64UrlDecode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function signToken(payload) {
  const secret = process.env.SESSION_SECRET || "dev-secret";
  const expiresHours = Number(process.env.SESSION_EXPIRES_HOURS || 12);
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresHours * 60 * 60,
  };
  const unsigned = `${base64UrlEncode(header)}.${base64UrlEncode(body)}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(unsigned)
    .digest("base64url");

  return `${unsigned}.${signature}`;
}

function verifyToken(token) {
  const secret = process.env.SESSION_SECRET || "dev-secret";
  const [header, body, signature] = String(token || "").split(".");

  if (!header || !body || !signature) {
    return null;
  }

  const unsigned = `${header}.${body}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(unsigned)
    .digest("base64url");

  if (
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return null;
  }

  const payload = base64UrlDecode(body);

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

module.exports = { signToken, verifyToken };
