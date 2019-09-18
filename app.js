const Koa = require('koa')
const Router = require('koa-router')
const render = require('koa-art-template')
const static = require('koa-static')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const mongoose = require('mongoose')
const koaBody = require('koa-body')
const cors = require('koa2-cors')

//Module
const User = require('./module/user')

//config
const db = require('./config/keys').mongoURL

//连接数据库
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('connected')
    })
    .catch(err => {
        console.log(err)
    })

const app = new Koa()

app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://sise.hanayo.club';
    },
    methods:['GET','POST'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

const router = new Router()

//ws
const server = require('http').Server(app.callback())
const io = require('socket.io')(server)
const port = 9000

//会产生一个唯一的socketId，该字典保存socketId到用户信息（昵称等）的映射
const connectionList = {}
//房间在线人数。
const countRoomPeople = {}

server.listen(process.env.PORT || port, () => {
    console.log(`Server running at ${port}`)
})

io.sockets.on('connection', (socket) => {
    //客户端连接时，保存socketId和用户名
    var socketId = socket.id;
    connectionList[socketId] = {
        socket: socket,
        roomid: "",
        username: "",
        img: ""
    }
    //接收到获取在线人数后，返回在线人数。
    socket.on('getPeopleOnline', function (data) {
        var online;
        if (countRoomPeople[data.roomid] == undefined) {
            online = 0;
        }
        else {
            online = countRoomPeople[data.roomid];
        }
        socket.emit('peopleOnline', {
            online: online,
            roomid: data.roomid,
            username: connectionList[socketId].username,
            img: connectionList[socketId].img
        })
    })

    socket.on('join', function (data) {
        connectionList[socketId].roomid = data.roomid;
        connectionList[socketId].username = data.username
        connectionList[socketId].img = data.img
        if (countRoomPeople[data.roomid] == undefined) {
            countRoomPeople[data.roomid] = 1;
        } else {
            countRoomPeople[data.roomid] = countRoomPeople[data.roomid] + 1;
        }
        socket.broadcast.emit('peopleOnline', {
            online: countRoomPeople[data.roomid],
            roomid: data.roomid
        })
    })

    //用户离开聊天室事件，删除CONNECT信息
    socket.on('disconnect', function () {
        countRoomPeople[connectionList[socketId].roomid] = countRoomPeople[connectionList[socketId].roomid] - 1;
        socket.broadcast.emit('peopleOnline', {
            online: countRoomPeople[connectionList[socketId].roomid],
            roomid: connectionList[socketId].roomid
        });
        delete connectionList[socketId];
    });

    //广播
    socket.on('say', function (data) {
        socket.broadcast.emit('broadcast_say', {
            roomid: data.roomid,
            text: data.text,
            type: data.type,
            color: data.color,
            username: connectionList[socketId].username,
            img: connectionList[socketId].img
        })
    })
})


//静态资源
const staticPath = './static'
app.use(static(
    path.join(__dirname, staticPath)
))

//upload
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 52428800    // 设置上传文件大小最大限制，默认2M
    }
}))

//配置art-template
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    // debug:process.env.NODE_ENV!=='production'
})

//配置session
app.keys = ['some secret hurr']
const CONFIG = {
    key: 'koa:sess',
    maxAge: 1000 * 60 * 60 * 24 * 5,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true,
}
app.use(session(CONFIG, app))

//配置post bodyParser
app.use(bodyParser())

//路由
router.get('/', async (ctx) => {
    ctx.status = 200
    const user = ctx.session.user
    const onlinelive = await User.find({
        index: 'yes',
        livetype: 'online'
    })
    const selflive = await User.find({
        index: 'yes',
        livetype: 'self'
    })
    const studylive = await User.find({
        index: 'yes',
        livetype: 'study'
    })
    const movielive = await User.find({
        index: 'yes',
        livetype: 'movie'
    })
    const musiclive = await User.find({
        index: 'yes',
        livetype: 'music'
    })
    if (user) {
        const findResult = await User.find({
            user: user
        })
        await ctx.render('index', {
            user: user,
            level: findResult[0].level,
            online: onlinelive,
            self: selflive,
            study: studylive,
            movie: movielive,
            music: musiclive
        })
    } else {
        await ctx.render('index', {
            online: onlinelive,
            self: selflive,
            study: studylive,
            movie: movielive,
            music: musiclive
        })
    }
})
router.redirect('/index.html', '/')
router.redirect('/index', '/')

router.get('/livepeople', async (ctx) => {
    ctx.status = 200
    const result = await User.find({
        index: 'yes'
    }, { user: 1 })
    ctx.body = { result }
})
router.get('/manage', async (ctx) => {
    const user = ctx.session.user
    await ctx.render('manage', {
        user: user,
    })
})
router.redirect('/manage.html', '/manage')

router.get('/register', async (ctx) => {
    await ctx.render('register')
})
router.redirect('/register.html', '/register')

router.get('/forget', async (ctx) => {
    await ctx.render('forget')
})
router.redirect('/forget.html', '/forget')

router.get('/account', async (ctx) => {
    const user = ctx.session.user
    const findResult = await User.find({
        user: user
    })
    const userinfo = findResult[0]
    await ctx.render('account', {
        user: userinfo.user,
        pic: userinfo.pic,
        bg: userinfo.bg,
        level: userinfo.level,
        email: userinfo.email,
        qq: userinfo.qq,
        email_check: userinfo.email_check,
        detail: userinfo.detail,
        livestatus: userinfo.livestatus,
        ask: userinfo.ask,
        hls: userinfo.hls,
        roomdetail: userinfo.roomdetail,
        index: userinfo.index,
        rtmpkey: userinfo.rtmpkey
    })
})
router.redirect('/account.html', '/account')

router.get('/room/:aid', async (ctx) => {
    const guest = ctx.session.user
    const findResult = await User.find({
        user: ctx.params.aid
    })
    const userinfo = findResult[0]
    if (guest != undefined) {
        const guestResult = await User.find({
            user: guest
        })
        const guestinfo = guestResult[0]
        await ctx.render('room', {
            user: guest,
            master: ctx.params.aid,
            detail: userinfo.detail,
            pic: userinfo.pic,
            hls: userinfo.hls,
            roomdetail: userinfo.roomdetail,
            img: guestinfo.pic
        })
    } else {
        //动态路由
        await ctx.render('room', {
            user: guest,
            master: ctx.params.aid,
            detail: userinfo.detail,
            pic: userinfo.pic,
            hls: userinfo.hls,
            roomdetail: userinfo.roomdetail,
            img: '/img/default.jpg'
        })
    }
})
router.get('/chatroom/:aid', async (ctx) => {
    const guest = ctx.session.user
    const findResult = await User.find({
        user: guest
    })
    const userinfo = findResult[0]
    //动态路由
    if (guest) {
        await ctx.render('chatroom', {
            master: ctx.params.aid,
            user: guest,
            img: userinfo.pic
        })
    } else {
        await ctx.render('chatroom', {
            master: ctx.params.aid,
            user: '游客',
            img: userinfo.pic
        })
    }
})

//引入api
const users = require('./api/users')
router.use('/api/users', users)

const upload = require('./api/upload')
router.use('/api/upload', upload)

const verify = require('./api/verify')
router.use(verify)

const manage = require('./api/manage')
router.use('/api/manage', manage)

//路由实例
app.use(router.routes())
app.use(router.allowedMethods())

//开启服务
app.listen(3000)
