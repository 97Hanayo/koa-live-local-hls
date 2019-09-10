const user = $('#user').val()
const master = $('#master').val()
const hls = $('#hls').val()
const img = $('#userpic').val()
const socket = io.connect('ws://localhost:9000'); //服务器地址

socket.on('connect', (data) => {
    socket.emit('join', {
        roomid: master,	//作为房间区分
        username: user,
        img: img
    })
    $("#msg").append("<span class='text-break' style='color:green'>连接到了聊天服务器</span><br>");
    //请求获取在线人数
    socket.emit('getPeopleOnline', {
        roomid: master
    })
})
socket.on('disconnect', (data) => {
    $("#msg").append("<span class='text-break' style='color:red'>聊天服务器好像有点不舒服哦</span><br>");
})

//收到在线人数改变
socket.on('peopleOnline', (data) => {
    if (data.roomid == master) {
        $("#online").text(data.online)
    }
})

//获取弹幕
function createApiBackend(onMessage) {
    const connect = () => {
        socket.on('broadcast_say', (data) => {
            if (data.roomid == master) {
                dp.danmaku.draw({
                    text: data.text,
                    color: data.color,
                    type: data.type
                })
                if (data.username != undefined || data.username != '') {
                    $("#msg").append(`<span class='text-break'>${data.username}：${data.text}</span><br>`)
                } else {
                    $("#msg").append(`<span class='text-break'>游客：${data.text}</span><br>`)
                }
            }
            
        })
    }
    return {
        read: function (options) {
            connect()
            options.success()
        },
        send: function send(options) {
            socket.emit('say', {
                roomid: master,
                text: options.data.text,
                color: options.data.color,
                type: options.data.type
            })
            if (user != undefined || user != '') {
                $("#msg").append(`<span class='text-break'>我：${options.data.text}</span><br>`)
            } else {
                $("#msg").append(`<span class='text-break'>游客：${options.data.text}</span><br>`)
            }
            options.success()
        }
    }
}

//首页状态更改
const close = $('button[name="indexoff"]')
const chatjump = $('button[name="chatroom"]')
$.get("../api/users/status", function (data) {
    if (data.index == 'no') {
        close.text('首页未显示')
        close.attr("disabled", "true")
        chatjump.attr("disabled", "true")
    } else {
        close.removeClass('btn-danger')
        close.addClass('btn-warning')
        close.text('关闭首页')
    }
})
close.click(function () {
    $.ajax({
        type: "POST",
        url: "../api/users/indexset",
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify({
            'index': 'no',
            'type': 'none',
            'roomdetail': $('#roomdetail').text()
        }),
        dataType: "json",
        success: function (response) {
            close.text('已关闭')
            close.removeClass('btn-warning')
            close.addClass('btn-success')
            close.attr("disabled", "true")
            return true
        }
    })
})

//聊天室跳转
chatjump.click(function () {
    window.open(`../chatroom/${master}`, 'chatroom', 'height=500,width=900,location=no')
})

//播放器
const dp = new DPlayer({
    container: document.getElementById('dplayer'),
    live: true,
    danmaku: true,
    autoplay: true,
    apiBackend: createApiBackend(function (dan) {
        dp.danmaku.draw(dan)
    }),
    video: {
        url: hls,
        type: 'hls'
    }
})