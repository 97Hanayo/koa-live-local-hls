$(function () {
    const socket = io.connect('ws://localhost:9000'); //服务器地址
    $.get("../livepeople", function (data) {
        const user=data.result
        for(let i=0;i<user.length;i++){
            socket.emit('getPeopleOnline', {
                roomid: user[i].user
            })
            //收到在线人数改变
            socket.on('peopleOnline', (data) => {
                if (data.roomid == user[i].user) {
                    $("#"+user[i].user).text(data.online)
                }
            })
        }
    })
})