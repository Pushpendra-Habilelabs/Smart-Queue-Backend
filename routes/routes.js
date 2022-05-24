const { controller } = require('../controllers');

module.exports = app => {
    // apis for connection
    app.get('/api/v1/user/count', controller.userCount)
    app.get('/api/v1/offline/device',controller.offlineCount)
    app.post('/api/v1/device/create', controller.createDevice)
    app.post('/api/v1/send-user/detail', controller.sendDataToServer) 
}