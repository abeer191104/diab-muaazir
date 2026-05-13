import emailjs from "@emailjs/nodejs";

const otpStore = global.otpStore || (global.otpStore = {});

function generateOTP() {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

export default async function handler(req, res) {

    if(req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { email } = req.body;

        if(!email) {
            return res.status(400).json({
                error: "Email required"
            });
        }

        const otp = generateOTP();

        otpStore[email] = {
            otp,
            expiry: Date.now() + 2 * 60 * 1000
        };

        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                to_email: email,
                passcode: otp
            },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY
            }
        );

        return res.status(200).json({
            success: true
        });

    } catch(err) {

        console.error(err);

        return res.status(500).json({
            error: err.message
        });
    }
}
