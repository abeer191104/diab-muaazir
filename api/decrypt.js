const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;

function decrypt(encryptedText) {

  const parsed = JSON.parse(encryptedText);

  const key = crypto
    .createHash("sha256")
    .update(SECRET_KEY)
    .digest();

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(parsed.iv, "hex")
  );

  decipher.setAuthTag(
    Buffer.from(parsed.tag, "hex")
  );

  let decrypted = decipher.update(
    parsed.content,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const decrypted = decrypt(
      req.body.encrypted
    );

    res.status(200).json({
      decrypted
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};