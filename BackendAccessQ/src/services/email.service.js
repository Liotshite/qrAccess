const nodemailer = require("nodemailer");

// Using real SMTP configuration (e.g. Brevo) loaded from environment variables
const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports (like 587)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter;
};

exports.sendVerificationEmail = async (toEmail, fullName, token) => {
    try {
        const transporter = await createTransporter();

        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"QR Access Security" <noreply@qraccess.local>',
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
        if (info.messageId) console.log("Message ID: %s", info.messageId);
        console.log("=========================================");

        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
};

exports.sendAgentInvitation = async (toEmail, fullName, rawPassword) => {
    try {
        const transporter = await createTransporter();
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const loginUrl = `${baseUrl}/login`;

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"QR Access Team" <noreply@qraccess.local>',
            to: toEmail,
            subject: "You've been invited as an Agent - QR Access",
            text: `Hello ${fullName},\n\nYou have been added as an Agent for your organization.\nYour email: ${toEmail}\nYour password: ${rawPassword}\n\nPlease login at: ${loginUrl}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #2563eb;">Welcome to QR Access!</h2>
                    <p>Hello <strong>${fullName}</strong>,</p>
                    <p>An administrator has invited you to manage scanning and ticketing for your organization's events.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px;"><strong>Email:</strong> ${toEmail}</p>
                        <p style="margin: 8px 0 0 0; font-size: 14px;"><strong>Temporary Password:</strong> ${rawPassword}</p>
                    </div>
                    <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; color: white; background-color: #2563eb; text-decoration: none; border-radius: 6px; font-weight: bold;">Login Now</a>
                    <p style="margin-top: 25px; font-size: 12px; color: #6b7280;">Please keep your credentials secure.</p>
                </div>
            `,
        });

        console.log("=========================================");
        console.log("📨 INVITATION EMAIL SENT");
        console.log(`To: ${toEmail}`);
        if (info.messageId) console.log("Message ID: %s", info.messageId);
        console.log("=========================================");

        return true;
    } catch (error) {
        console.error("Error sending agent invitation email:", error);
        return false;
    }
};

