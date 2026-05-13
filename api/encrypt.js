const crypto = require("crypto");

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

  let encrypted = cipher.update(text, "utf8", "hex");

  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString("hex"),
    content: encrypted,
    tag: authTag.toString("hex")
  });
}

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const encrypted = encrypt(
      JSON.stringify(req.body)
    );

    res.status(200).json({
      encrypted
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};