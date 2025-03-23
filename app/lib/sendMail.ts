import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // SSL si port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Évite certains problèmes TLS
    },
});

export async function sendMail(email: string, subject: string, htmlContent: string) {
    const mailOptions = {
        from: process.env.EMAIL_SUPPORT,
        to: email,
        subject: subject,
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
}
