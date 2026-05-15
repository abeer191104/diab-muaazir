import emailjs from "@emailjs/nodejs";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      email,
      glucose,
      status
    } = req.body;

    if (!email || !glucose || !status) {
      return res.status(400).json({
        error: "Missing fields"
      });
    }

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_ALERT_TEMPLATE_ID,
      {
        to_email: email,
        glucose,
        status
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );

    return res.status(200).json({
      success: true
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}
