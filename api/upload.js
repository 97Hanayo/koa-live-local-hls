const Router = require('koa-router')
const path = require('path')
const fs = require('fs')

const User = require('../module/user')

const router = new Router()

router.post('/pic', async (ctx, next) => {
    ctx.status = 200
    user = ctx.session.user
    const file = ctx.request.files.avatar
    const reader = fs.createReadStream(file.path)
    let filePath = path.join(__dirname, '../static/img/pic') + `/${file.name}`
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)
    await User.updateOne({
        user: user
    },
        {
            $set: {
                pic: `/img/pic/${file.name}`
            }
        })
    return true
})

router.post('/bg', async (ctx, next) => {
    ctx.status = 200
    user = ctx.session.user
    const file = ctx.request.files.bgimg
    const reader = fs.createReadStream(file.path)
    let filePath = path.join(__dirname, '../static/img/bg') + `/${file.name}`
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)
    await User.updateOne({
        user: user
    },
        {
            $set: {
                bg: `/img/bg/${file.name}`
            }
        })
    return true
})


module.exports = router.routes()