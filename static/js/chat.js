const master = $('#master').val()
const user = $('#user').val()
let img = $('#userpic').val()
const socket = io.connect('ws://localhost:9000'); //服务器地址

const date = new Date()
const h = conver(date.getHours())
const m = conver(date.getMinutes())

socket.on('connect', (data) => {
    socket.emit('join', {
        roomid: master,	//作为房间区分
        username: user,
        img: img
    })
    $("#message_box").append(`<div class="msg_item fn-clear">
    <div class="uface">
    <img src="../img/default.jpg" width="40" height="40" alt="" />
    </div>
    <div class="item_right">
        <div class="msg">加入聊天室</div>
        <div class="name_time">系统 · ${h}:${m}</div>
    </div>
    </div>`);
    //请求获取在线人数
    socket.emit('getPeopleOnline', {
        roomid: master
    })
})
socket.on('disconnect', (data) => {
    // $("#message_box").append("<span class='text-break' style='color:red'>聊天服务器好像有点不舒服哦</span><br>");
})

//收到在线人数改变
socket.on('peopleOnline', (data) => {
    if (data.roomid == master) {
        $("#online").text(data.online)
    }
})

//收到别人发送的消息后，显示消息
socket.on('broadcast_say', function (data) {
    if (data.roomid == master) {
        const date = new Date()
        const h = conver(date.getHours())
        const m = conver(date.getMinutes())
        const text = data.text;
        const img = data.img
        const user = data.username
        //显示在消息记录
        $("#message_box").append(`
        <div class="msg_item fn-clear">
            <div class="uface"><img src="..${img}" width="40" height="40" alt="" /></div>
            <div class="item_right">
              <div class="msg">${text}</div>
              <div class="name_time">${user} · ${h}:${m}</div>
            </div>
          </div>
        `)
        $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
    }
});
$('.sub_but').click(function () {
    send();
});
function send() {
    //获取文本框的文本
    let text = $("#message").val()
    const date = new Date()
    const h = conver(date.getHours())
    const m = conver(date.getMinutes())
    if (text == '') {
        console.log(text)
    } else {
        $("#message").val("")
        //提交一个say事件，服务器收到就会广播
        socket.emit('say', {
            text: text,
            roomid: master
        });
        text = text.replace(/</g, '');
        text = text.replace(/>/g, '');
        //显示在消息记录
        $("#message_box").append(`
        <div class="msg_item fn-clear">
            <div class="uface">
                <img src="..${img}" width="40" height="40"  alt=""/>
            </div>
                <div class="item_right">
                    <div class="msg own">${text}</div>
                    <div class="name_time">${user} · ${h}:${m}</div>
                </div>
            </div>
        `);
        $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
    }
}

function conver(s) {
    return s < 10 ? '0' + s : s;
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

$(function () {
    $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
    $("#message").keydown(function (event) {
        const e = window.event || event;
        const k = e.keyCode || e.which || e.charCode;
        //按下ctrl+enter发送消息
        if (k == 13) {
            send();
        }
    })
})