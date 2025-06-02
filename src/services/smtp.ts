import resend from "../config/resend";

interface Mailfields { from: string, to: string, subject: string, html: string }

export async function sendMail(mailFields: Mailfields) {
    const res = await resend.emails.send({
        from: mailFields.from,
        to: mailFields.to,
        subject: mailFields.subject,
        html: mailFields.html
    });
    console.log("Your mail sent successfully!")
    console.log(res);
}