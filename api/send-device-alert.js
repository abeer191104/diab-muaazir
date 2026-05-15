import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    const {
      email,
      type,
      battery
    } = req.body;

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    let subject = "";
    let html = "";

    // =========================
    // LOW BATTERY
    // =========================

    if (type === "battery") {

      subject =
        "Low Pump Battery Alert";

      html = `
        <div style="font-family:Arial;padding:20px;">
          <h2 style="color:#d97706;">
            ⚠ Pump Battery Low
          </h2>

          <p>
            Your insulin pump battery is currently:
          </p>

          <h1 style="color:red;">
            ${battery}%
          </h1>

          <p>
            Please charge or replace the battery soon.
          </p>
        </div>
      `;
    }

    // =========================
    // DEVICE DISCONNECTED
    // =========================

    else if (type === "disconnect") {

      subject =
        "Pump Connection Lost";

      html = `
        <div style="font-family:Arial;padding:20px;">
          <h2 style="color:#dc2626;">
            ⚠ Pump Disconnected
          </h2>

          <p>
            Your insulin pump appears to be disconnected.
          </p>

          <p>
            Please check:
          </p>

          <ul>
            <li>Bluetooth connection</li>
            <li>Pump distance</li>
            <li>Device power</li>
          </ul>
        </div>
      `;
    }

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject,

      html
    });

    return res.status(200).json({
      success: true
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
