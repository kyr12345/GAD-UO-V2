const nodemailer = require('nodemailer')

const sendmail = async (options) => {

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service: "gmail", 
    auth: {
      user:"trialwebproject001@gmail.com", // generated ethereal user
      pass: "project@2022", // generated ethereal password
    },
  })

  const mailoptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(mailoptions)
}

module.exports = sendmail
