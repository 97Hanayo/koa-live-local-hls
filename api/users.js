const Router = require('koa-router')
const randomstring = require("randomstring")
const md5 = require('md5-node')

const User = require('../module/user')

//Email Module
const sendEmail = require('../module/sendemail')

const router = new Router()

//注册api
router.post('/register', async (ctx) => {
    // ctx.body = ctx.request.body
    ctx.status = 200
    //存储数据库
    const newUser = new User({
        user: ctx.request.body.user,
        email: ctx.request.body.email,
        password: ctx.request.body.password,
        qq: ctx.request.body.qq,
        pic: '/img/default.jpg',
        bg: '/img/bk.jpg',
        email_check: 'no',
        level: 1,
        detail: '这个人很懒',
        livestatus: 'no',
        token: ctx.request.body.token
    })
    await newUser.save().then(user => {
        ctx.body = user
        let emailCode = user.token
        let url = 'http://localhost:9000/verify?verify='
        let email = {
            title: '这是一个验证邮件',
            htmlBody: `亲爱的${user.user}：<br/>欢迎来到Live--はな直播网。<br/>请点击下面的链接来激活您的帐号。<br/>
            <a href='${url}${emailCode}' target=
        '_blank'>${url}${emailCode}</a><br/>
            如果以上链接无法点击，请将它复制到你的浏览器地址栏中进入访问，该链接1小时内有效。`,
        }
        let mailOptions = {
            from: '',
            to: user.email,
            subject: email.title,
            html: email.htmlBody
        }
        sendEmail.send(mailOptions)
    }).catch(err => {
        console.log(err)
    })
})

//重发邮件
router.post('/resend', async (ctx) => {
    ctx.status = 200
    const user = ctx.session.user
    const token_time = Date.now() + 3600000
    await User.updateOne({
        user: user
    },
        {
            $set: {
                token: ctx.request.body.token,
                token_time: token_time
            }
        }).then(user => {
            username = ctx.session.user
            let emailCode = ctx.request.body.token
            let url = 'http://localhost:9000/verify?verify='
            let email = {
                title: '这是一个验证邮件',
                htmlBody: `亲爱的${username}：<br/>欢迎来到Live--はな直播网。<br/>请点击下面的链接来激活您的帐号。<br/>
                <a href='${url}${emailCode}' target=
            '_blank'>${url}${emailCode}</a><br/>
                如果以上链接无法点击，请将它复制到你的浏览器地址栏中进入访问，该链接1小时内有效。`,
            }
            let mailOptions = {
                from: '',
                to: ctx.request.body.email,
                subject: email.title,
                html: email.htmlBody
            }
            sendEmail.send(mailOptions)
        })
    ctx.body = { success: true }
    return true
})

//发送验证码
router.post('/send', async (ctx) => {
    ctx.status = 200
    const emailCode_time = Date.now() + 600000
    const code = randomstring.generate({
        length: 6,
        charset: 'numeric'
    })
    const emailCode = md5(code)
    await User.updateOne({
        email: ctx.request.body.email
    },
        {
            $set: {
                emailCode: emailCode,
                emailCode_time: emailCode_time
            }
        }).then(user => {
            let email = {
                title: '神必代码',
                htmlBody: `这里有一串很神必的代码，${code}，只有十分钟有用哦ヽ（≧□≦）ノ`,
            }
            let mailOptions = {
                from: ' ',
                to: ctx.request.body.email,
                subject: email.title,
                html: email.htmlBody
            }
            sendEmail.send(mailOptions)
        })
    ctx.body = { success: true }
    return true
})

//比对验证码
router.post('/codecheck', async (ctx) => {
    ctx.status = 200
    const time = Date.now()
    const code = ctx.request.body.code
    const email = ctx.request.body.email
    const findResult = await User.find({
        email: email
    })
    const userinfo = findResult[0]
    if (new Date(userinfo.emailCode_time).getTime() < time) {
        //超时
        return false
    } else if (code != userinfo.emailCode) {
        return false
    } else {
        ctx.body = findResult
        return true
    }
})

//查询用户名
router.post('/usercheck', async (ctx) => {
    ctx.status = 200
    const findResult = await User.find({
        user: ctx.request.body.user
    })
    if (findResult.length > 0) {
        ctx.body = findResult
        return false
    } else {
        return true
    }
})

//查询邮箱
router.post('/emailcheck', async (ctx) => {
    ctx.status = 200
    const findResult = await User.find({
        email: ctx.request.body.email
    })
    if (findResult.length > 0) {
        ctx.body = findResult
        return false
    } else {
        return true
    }
})

//登陆
router.post('/login', async (ctx) => {
    ctx.status = 200
    const findResult = await User.find({
        user: ctx.request.body.name
    })
    const userinfo = findResult[0]
    const password = ctx.request.body.password
    if (findResult.length == 0) {
        ctx.status = 404
        ctx.body = { success: false }
    } else {
        if (password == userinfo.password) {
            ctx.status = 200
            ctx.session.user = userinfo.user
            ctx.body = { success: true }
            return true
        } else {
            ctx.status = 200
            ctx.body = { success: false }
            return false
        }
    }
})

//注销
router.get('/logout', async (ctx) => {
    ctx.status = 200
    ctx.session = null
    ctx.response.redirect('/');
})

//编辑资料
router.post('/edit', async (ctx) => {
    ctx.status = 200
    user = ctx.session.user
    await User.updateOne({
        user: user
    },
        {
            $set: {
                detail: ctx.request.body.detail
            }
        })
    ctx.body = { success: true }
    return true
})

//查询密码
router.post('/pwdcheck', async (ctx) => {
    ctx.status = 200
    user = ctx.session.user
    const findResult = await User.find({
        user: user
    })
    const userinfo = findResult[0]
    const password = ctx.request.body.old
    if (password == userinfo.password) {
        ctx.status = 200
        ctx.body = { success: true }
        return true
    } else {
        ctx.status = 200
        ctx.body = { success: false }
        return false
    }
})

//修改密码
router.post('/pwdreset', async (ctx) => {
    ctx.status = 200
    const user = ctx.session.user
    const email = ctx.request.body.email
    if (user == undefined) {
        await User.updateOne({
            email: email
        },
            {
                $set: {
                    password: ctx.request.body.password
                },
                $unset: {
                    emailCode: '',
                    emailCode_time: ''
                }
            })
    } else {
        await User.updateOne({
            user: user
        },
            {
                $set: {
                    password: ctx.request.body.password
                },
            })
    }
    ctx.body = { success: true }
    ctx.session = null
    return true
})

//首页显示查询接口
router.get('/status', async (ctx) => {
    ctx.status = 200
    user = ctx.session.user
    const findResult = await User.find({
        user: user
    })
    const userinfo = findResult[0]
    ctx.body = { index: userinfo.index, livetype: userinfo.livetype }
})

//申请直播
router.post('/ask', async (ctx) => {
    ctx.status = 200
    user = ctx.session.user
    await User.updateOne({
        user: user
    }, {
            $set: {
                ask: ctx.request.body.ask
            }
        })
    ctx.body = { success: true }
    return true
})

//设置首页
router.post('/indexset', async (ctx) => {
    const clientIP = ctx.request.ip.match(/\d+.\d+.\d+.\d+/)
    const hls = `http://${clientIP[0]}:8080/.m3u8`
    ctx.status = 200
    user = ctx.session.user
    await User.updateOne({
        user: user
    }, {
        $set: {
            index: ctx.request.body.index,
            livetype: ctx.request.body.type,
            roomdetail: ctx.request.body.roomdetail,
            rtmpkey: ctx.request.body.rtmpkey,
            hls: hls
        }
    })
    ctx.body = { success: true, hls: hls }
    return true
})

//设置资料
router.post('/detailset', async (ctx) => {
    ctx.status = 200
    user = ctx.session.user
    await User.updateOne({
        user: user
    }, {
            $set: {
                hls: ctx.request.body.hls,
                roomdetail: ctx.request.body.roomdetail
            }
        })
    ctx.body = { success: true }
    return true
})

module.exports = router.routes()
