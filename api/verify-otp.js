const otpStore = global.otpStore || (global.otpStore = {});

export default async function handler(req, res) {

    if(req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { email, otp } = req.body;

        const saved = otpStore[email];

        if(!saved) {
            return res.status(400).json({
                success: false,
                error: "OTP not found"
            });
        }

        if(Date.now() > saved.expiry) {

            delete otpStore[email];

            return res.status(400).json({
                success: false,
                error: "OTP expired"
            });
        }

        if(saved.otp !== otp) {

            return res.status(400).json({
                success: false,
                error: "Incorrect OTP"
            });
        }

        delete otpStore[email];

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
