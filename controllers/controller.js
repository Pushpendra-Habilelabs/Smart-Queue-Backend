const Message = require('../constants/error-message')
const MessageCode = require('../constants/status-message')
const { Response } = require('../utils')
const axios = require('axios');

module.exports.sendTurnSMS = async (req, res) => {
    try {
        const info = req.body
        let message = `You'll have your turn in ${info.minutes} minutes, current number is ${info.currentNo} so please be ready at ${info.queueName}. - Queue Management Service by Habileabs.`
        const data = {
            "api-key": "A19b055702ac13e925677a3fe2e792c88",
            "to": `91${info.mobile}`,
            "type": "OTP",
            "sender": "EXMSBK",
            "template_id": "1007166210703101581",
            "body": message
        };
        const res = await axios.post("https://api.kaleyra.io/v1/HXIN1701515598IN/messages", data);
        if (res.response.status === 200)
            console.log("Message send successfully")
        else
            console.log("Message send failed!");
        return Response.commonResponse(res, MessageCode.SUCCESS, Message.SUCCESS, res)
    } catch (e) {
        console.log(e);
        return Response.commonResponse(res, MessageCode.INTERNAL_ERROR, Message.INTERNAL_SERVER)
    }
}
