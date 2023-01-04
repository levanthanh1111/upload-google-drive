const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
require('dotenv').config();

const host = process.env.MAIL_HOST
const service = process.env.MAIL_SERVICE
const account = process.env.MAIL_ACCOUNT
const password = process.env.MAIL_PASSWORD
const transporter = nodemailer.createTransport({
    host: host,
    service: service,
    port: 587,
    secure: true,
    auth: {
        user: account,
        pass: password,
    },
});
const handlebarOptions = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve(''),
        defaultLayout: false,
    },
    viewPath: path.resolve(''),
    extName: ".hbs",
}
module.exports = {
    sendMailGitlab: async (
        email,
        content,
        subject = 'Backup-Gitlab',
        title = "Notification Gitlab"
    ) => {
        try {
            const mailOptions = {
                from: `"${title}" <${account}>`,
                to: email,
                subject: subject,
                template: 'sendmail',
                context: {
                    content
                },
            }
            transporter.use('compile', hbs(handlebarOptions));
            await transporter.sendMail(mailOptions);
            console.log("SEND MAIL SUCCESS")
        } catch (error) {
            console.log(error)
        }
    }
}
