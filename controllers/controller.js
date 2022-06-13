const Message = require('../constants/error-message')
const MessageCode = require('../constants/status-message')
const { getUserCount, createDevice, sendDataToServer, getDeviceList, getOfflineCount, getTotalCount } = require('../modules')
const { Response } = require('../utils')
const moment = require('moment');

module.exports.userCount = async (req, res) => {
    try {
        const { device } = req.params
        const userCount = await getUserCount(device)
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.SUCCESS, userCount)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}

module.exports.offlineCount = async (req, res) => {
    try {
        const { device } = req.params
        const offlineCount = await getUserCount(device)
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
        let userCount = await getUserCount(userDetails.deviceName)
        userCount = Number(userCount)
        if (userCount > 1) {
            userCount + 1
        }
        userDetails.timeStamp = moment(new Date()).format('YYYY-MM-DD/HH:mm:ss')
        userDetails.count = Number(userCount) + 1
        await sendDataToServer(userDetails)
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.DETAILS_OBTAINED, userCount)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}

module.exports.getDeviceList = async (req, res) => {
    try {
        let user = req.params.user
        // let deviceList = []
        // let queueList = []
        const fetchList = await getDeviceList(user)

        // if (fetchList && fetchList.length) {
        //     fetchList.forEach(element => {
        //         const device = element.slice(
        //             element.indexOf('__') + 1,
        //             element.lastIndexOf('--'),
        //         );
        //         deviceList.push(device)
        //         const queue = element.slice(
        //             element.indexOf('--') + 1,
        //             element.lastIndexOf('.'),
        //         );
        //         queueList.push(queue)
        //     });
        // }

        return Response.commonResponse(res, MessageCode.SUCCESS, Message.SUCCESS, fetchList)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}

module.exports.getTotalCount = async (req, res) => {
    try {
        const { device } = req.params
        const offlineCount = await getTotalCount(device)
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.SUCCESS, offlineCount)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}
