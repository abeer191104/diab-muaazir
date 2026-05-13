import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY;

function encrypt(text) {

  const iv = crypto.randomBytes(16);

  const key = crypto
    .createHash("sha256")
    .update(SECRET_KEY)
    .digest();

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  let encrypted = cipher.update(
    text,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString("hex"),
    content: encrypted,
    tag: tag.toString("hex")
  });
}

export default async function handler(req, res) {

  try {

    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY missing");
    }

    const body = req.body || {};

    const encrypted = encrypt(
      JSON.stringify(body)
    );

    return res.status(200).json({
      encrypted
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}
