// const nodemailer = require("nodemailer");
// const mailer = require('../mailer/mailer')
// exports.contact =  (req, res) => {
// //   var name = req.body.name;
// //   var from = req.body.from;
// //   var message = req.body.message;
// //   var to = "jn";
//   console.log("@@@@@@@@@@@@@@@ In caller ###############");
// //   try {
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "amitperane8473@gmail.com", // generated ethereal user
//         pass: "jaymaharashtra", // generated ethereal password
//       },
//     });
//     //
//     var mailoptions = {
//       from: "amitperane8473gmail.com",
//       to: ["amitperane@gmail.com"],
//       subject: "Sending Email using Node.js",
//       text: "That was easy!",
//     };
//      transporter.sendMail({
//       mailoptions,
//       function(err, res) {
//         if (err) {
//           return res.status(200).json({
//             message: err.message,
//           });
//         }
//         return res.status(200).json({ message: "success" });
//       },
//     });
// //   } catch (error) {
// //     console.log(error);
// //     return res.json({ message: message });
// //   }
// };

// // let mailTemplate = (data, relativePath) => {
// //   let mailhtml;
// //   await transporter.sendMail({
// //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
// //     to: "bar@example.com, baz@example.com", // list of receivers
// //     subject: "Hello ✔", // Subject line
// //     text: "Hello world?", // plain text body
// //     html: mailTemplate, // html body
// //   });
// // };

// // let mailTemplate = (data, relativePath) => {
// //   let mailhtml;
// //   ejs.renderfile(
// //     path.join(__dirname, "../mailerTemp/temlpate"),
// //     data,
// //     (err, template) => {
// //       if (err) {
// //         return res.status(500).json({
// //           message: err.message,
// //           messageManual: "error in rendering template.",
// //         });
// //       }
// //       mailhtml = template;
// //     }
// //   );
// //   return mailhtml;
// // };

// // module.exports = {
// //   transporter,
// //   rem,
// // };
