const Router = require('koa-router')

const User = require('../module/user')

const router = new Router()

//验证邮箱
router.get('/verify', async (ctx) => {
    const verify = ctx.query.verify
    const user = ctx.session.user
    const findResult = await User.find({
        user: user
    })
    const userinfo = findResult[0]
    const time = Date.now()
    if (user == '' || user == null) {
        await ctx.render('verify')
    } else if (new Date(userinfo.token_time).getTime() < time) {
        //超时
        await ctx.render('verify', {
            user: user,
            email:userinfo.email,
            status: 'exp'
        })
    } else if (verify != userinfo.token) {
        await ctx.render('verify', {
            user: user,
            email:userinfo.email,
            status: 'untrue'
        })
    } else if (userinfo.email_check == 'yes') {
        await ctx.render('verify', {
            user: user,
            status: 'reverify'
        })
    } else {
        await User.updateOne({
            user: user
        },
            {
                $set: {
                    email_check: 'yes'
                },
                $unset:{
                    token:'',
                    token_time:''
                }
            })
        await ctx.render('verify', {
            user: user,
            status: 'true'
        })
    }
})
router.redirect('/verify.html', '/verify')

module.exports = router.routes()