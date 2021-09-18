const nodemailer = require("nodemailer");

const emailId = require("../controller/email_controller");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_ID_PASSWORD,
  },
});

const emailIdResolve = emailId.getAllEmails();
// console.log(emailIdResolve);
exports.newProduct = async (product) => {
  const emailIds = await emailIdResolve;
  // console.log("emailIds.email =>", emailIdResolve);
  emailIds.map((id) => {
    console.log(id.email);
    var options = {
      from: "amitperane8473@gmail.com",
      to: id.email,
      subject: `Hello ${id.name} , " ${product.name}  is added in cart`,
      html: "<h2>That was easy!</h1>",
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log("############### Error ########", err);
        return;
      }
      console.log("mail delivered  ", info);
    });
  });
  // console.log(emailIds) ===>
  // emailId =[
  // ****@gmail.com
  // ****gmail.com
  // ****@gmail.com
  // ****@gmail.com
  // ]
};
