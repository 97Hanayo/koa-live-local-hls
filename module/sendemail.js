const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "",// 邮件地址
    port: 25,// 端口
    secureConnection: false, // use SSL
    auth: {
        "user": '', // 邮箱账号
        "pass": ''         // 密码
    }
});
module.exports.send =  (mailOptions) => {
    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            return console.log(error);
        }
    })
}