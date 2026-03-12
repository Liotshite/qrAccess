const nodemailer = require("nodemailer");

// Using Ethereal Email for testing (fake SMTP service by Nodemailer)
// It catches all emails and provides a URL to view them without actually sending to real addresses.
const createTransporter = async () => {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    return transporter;
};

exports.sendVerificationEmail = async (toEmail, fullName, token) => {
    try {
        const transporter = await createTransporter();

        // Ensure the NextJS frontend is running on 3000
        const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;

        const info = await transporter.sendMail({
            from: '"QR Access Security" <noreply@qraccess.local>',
            to: toEmail,
            subject: "Verify Your Email Address - QR Access",
            text: `Hello ${fullName},\n\nPlease verify your email by clicking the following link:\n${verifyUrl}\n\nIf you did not request this, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Welcome to QR Access!</h2>
                    <p>Hello <strong>${fullName}</strong>,</p>
                    <p>Thank you for registering. To activate your account and access your dashboard, please click the button below:</p>
                    <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; margin-top: 15px; color: white; background-color: #2563eb; text-decoration: none; border-radius: 5px;">Verify My Email</a>
                    <p style="margin-top: 25px; font-size: 12px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; color: #3b82f6;">${verifyUrl}</p>
                </div>
            `,
        });

        console.log("=========================================");
        console.log("📨 EMAIL SENT FOR VERIFICATION");
        console.log(`To: ${toEmail}`);
        console.log("Preview URL To Click: %s", nodemailer.getTestMessageUrl(info));
        console.log("=========================================");

        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
};
