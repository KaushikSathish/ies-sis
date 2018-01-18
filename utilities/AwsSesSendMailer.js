'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'email-smtp.us-west-2.amazonaws.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "AKIAIL4AF6NMNNGP5NBQ", // generated ethereal user
        pass: "AjGp2UP36ywDKlef2AVKpB6Hap48eIIe8lzIf/t0LUER"  // generated ethereal password
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: 'support@psgsoftwaretechnologies.com', // sender address
    to: 'support@psgsoftwaretechnologies.com', // list of receivers
    subject: 'AWS SES', // Subject line
    text: 'Hello SES', // plain text body
    html: '<b>Hello SES?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

});
