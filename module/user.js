const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//实例化数据模板
const UserSchema = new Schema({
    user: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    qq: {
        type: String,
        require: true
    },
    regdate: {
        type: Date,
        default: Date.now
    },
    pic: {
        type: String
    },
    bg: {
        type: String
    },
    email_check: {
        type: String
    },
    level: {
        type: Number
    },
    detail: {
        type: String
    },
    token: {
        type: String
    },
    token_time: {
        type: Date,
        default: Date.now() + 3600000  //一小时
    },
    index: {
        type: String
    },
    ask: {
        type: String
    },
    livestatus: {
        type: String
    },
    hls: {
        type: String
    },
    roomdetail: {
        type: String
    },
    emailCode: {
        type: String
    },
    emailCode_time: {
        type: Date,
        default: Date.now() + 3600000  //一小时
    },
    livetype: {
        type: String
    }
})

module.exports = User = mongoose.model('user', UserSchema);