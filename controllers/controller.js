const Message = require('../constants/error-message')
const MessageCode = require('../constants/status-message')
const { getUserCount, createDevice, sendDataToServer, getOfflineCount } = require('../modules')
const { Response } = require('../utils')
const moment = require('moment');

module.exports.userCount = async (req, res) => {
    try {
        const userCount = await getUserCount()
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.SUCCESS, userCount)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}

module.exports.offlineCount = async (req, res) => {
    try {
        const offlineCount = await getOfflineCount()
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.SUCCESS, offlineCount)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}

module.exports.createDevice = async (req, res) => {
    try {
        const { device } = req.body
        if (!device) {
            return Response.commonResponse(res, MessageCode.BAD_REQUEST, Message.BAD_REQUEST)
        }
        await createDevice(device)
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.DEVICE_CREATED)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}

module.exports.sendDataToServer = async (req, res) => {
    try {
        let userDetails = req.body
        if (!userDetails) {
            return Response.commonResponse(res, MessageCode.BAD_REQUEST, Message.BAD_REQUEST)
        }
        const userCount = await getUserCount()
        userDetails.timeStamp = moment(new Date()).format('YYYY-M-DD/HH:mm:ss')
        userDetails.count = Number(userCount) + 1
        await sendDataToServer(userDetails)
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.DETAILS_OBTAINED, userCount)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}

