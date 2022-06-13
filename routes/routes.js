const { controller } = require('../controllers');

module.exports = app => {
    // apis for connection
    app.get('/api/v1/user/count/:device', controller.userCount)
    app.get('/api/v1/offline/device/:device',controller.offlineCount)
    app.post('/api/v1/device/create', controller.createDevice)
    app.post('/api/v1/send-user/detail', controller.sendDataToServer)
    app.get('/api/v1/device-list/:user', controller.getDeviceList) 
    app.get('/api/v1/total-count/:device', controller.getTotalCount) 
}