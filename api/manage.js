const Router = require('koa-router')

const User = require('../module/user')

const router = new Router()

router.get('/all', async (ctx) => {
    const user = ctx.session.user
    const findResult = await User.find({
        user: user
    })
    if (user == '' || user == null || user == undefined) {
        ctx.status = 404
    } else if (findResult[0].level == 3 || findResult[0].level == 5) {
        ctx.status = 200
        await User.find({}, (err, data) => {
            ctx.body = data
            return data
        })
    } else {
        ctx.status = 404
    }
})

router.post('/askset', async (ctx) => {
    ctx.status = 200
    const user = ctx.request.body.user
    if (ctx.request.body.livestatus == `yes`) {
        await User.updateOne({
            user: user
        }, {
                $set: {
                    livestatus: ctx.request.body.livestatus,
                },
                $unset: {
                    ask: ''
                }
            })
        ctx.body = { success: true }
        return true
    } else {
        await User.updateOne({
            user: user
        }, {
                $set: {
                    ask: 'yes',
                    livestatus: ctx.request.body.livestatus
                }
            })
        ctx.body = { success: true }
        return true
    }
})

router.post('/indexset', async (ctx) => {
    ctx.status = 200
    await User.updateOne({
        user: ctx.request.body.user
    }, {
            $set: {
                index: ctx.request.body.index,
            }
        })
    ctx.body = { success: true }
    return true
})

router.post('/emailset', async (ctx) => {
    ctx.status = 200
    await User.updateOne({
        user: ctx.request.body.user
    }, {
            $set: {
                email_check: ctx.request.body.email_check
            }
        })
    ctx.body = { success: true }
    return true
})

router.post('/livestatusset', async (ctx) => {
    ctx.status = 200
    await User.updateOne({
        user: ctx.request.body.user
    }, {
            $set: {
                livestatus: ctx.request.body.livestatus
            },
            $unset: {
                ask: ''
            }
        })
    ctx.body = { success: true }
    return true
})

router.post('/manageset', async (ctx) => {
    ctx.status = 200
    await User.updateOne({
        user: ctx.request.body.user
    }, {
            $set: {
                level: ctx.request.body.level
            }
        })
    ctx.body = { success: true }
    return true
})

module.exports = router.routes()