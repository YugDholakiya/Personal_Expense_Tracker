//const Bravo = require("@getbrevo/brevo");
const https = require("https");
const crypto = require("crypto");
require('dotenv').config();
const  redisClient  = require("../config/redis");
const nodemailer = require("nodemailer");


async function sendEmail(userData) {
  try {
    const secret = crypto.randomBytes(3).toString("hex");
    console.log("Generate Otp: ", secret);

//     console.log(process.env.BREVO_API_KEY)
//     console.log(userData);
// const apiInstance = new Bravo.TransactionalEmailsApi();
// apiInstance.setApiKey(
//   Bravo.TransactionalEmailsApiApiKeys.apiKey,
//   process.env.BREVO_API_KEY
// );

//     console.log(apiInstance);
    
//     const sendSmtpEmail = {
//       to: [{ email: userData.email }],
//       sender: { email: "dholakiyayug11@gmail.com", name: "Yug Dholakiya" },
//       subject: "OTP for verification",
//       htmlContent: `<h1>Your OTP is: ${secret}</h1><p>Expires in 5 minutes.</p>`,
//     };
//     console.log("hi");
//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log(response);

// console.log(process.env.BREVO_SMTP_USER);
// console.log(process.env.BREVO_SMTP_KEY);
//      const transporter = nodemailer.createTransport({
//       host: "smtp-relay.brevo.com",
//       port: 587,
//       secure: false, 
//       auth: {
//         user: process.env.BREVO_SMTP_USER,   
//         pass: process.env.BREVO_SMTP_KEY,    
//       },
//     });
//     console.log("transporter: ", transporter);

//       const info = await transporter.sendMail({
//       from: `"Yug Dholakiya" <${process.env.BREVO_SMTP_USER}>`,
//       to: "dholakiyayug11@gmail.com", 
//       subject: "OTP Verification",
//       html: `<h1>Your OTP is ${secret}</h1>`,
//     });

//     console.log("info: ", info);

    const postData = JSON.stringify({
      sender: {
        name: "Yug Dholakiya",
        email: "dholakiyayug11@gmail.com",
      },
      to: [
        {
          email: userData.email,
        },
      ],
      subject: "OTP for verification",
      htmlContent: `<h1>Your OTP is: ${secret}</h1><p>Expires in 5 minutes.</p>`,
    });

    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const data = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });

    console.log("Brevo Response:", data);

    const { name, email, password } = userData;
    await redisClient.set(`otp:${email}`, secret,{ EX: 300 });
    await redisClient.set(
      `user:${email}`,
      JSON.stringify({ name, email, password }),
      { EX: 300 }
    );

    return true;
  } catch (err) {
    console.log("Error: ",err);
    console.log("This is Error from Email Send");
    return false;
  }
}

module.exports = sendEmail;