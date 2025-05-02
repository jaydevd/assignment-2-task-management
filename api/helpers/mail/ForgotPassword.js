const { transporter } = require("../../config/transporter");

const SendPasswordResetMail = async (URL, email) => {
    console.log("inside the function to send password reset mail");
    try {
        const mailOptions = {
            from: `jaydevdwd@gmail.com`,
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${URL}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log(`Email sent: ${info.response}`);
                res.status(200).send('Check your email for instructions on resetting your password');
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { SendPasswordResetMail };