const { controller } = require('../controllers');

module.exports = app => {
    // apis for connection
    app.post('/api/v1/qmd/turn-send-sms', controller.sendTurnSMS)
}