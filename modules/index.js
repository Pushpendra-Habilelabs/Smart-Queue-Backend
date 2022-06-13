const axios = require('axios');
var fs = require('fs');
const moment = require('moment');

let getUserCount = (device) => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://3366oiq0z6.execute-api.eu-central-1.amazonaws.com/default/Storing_data_dynamodb', {
                "TableName": "QMS_Device",
                "Data": "",
                "Find": `${device}_Device` //App details goes here
            })
            .then(function (response) {
                let userNumber = 0
                if (response.data.Data && response.data?.Data.length) {
                    let date = response.data.Data[0].Date_Time.S.split('/')[0]
                    if (date.toString().trim() == moment(new Date()).format('YYYY-MM-DD').toString().trim()) {
                        console.log('same day');
                        userNumber = response.data.Data[0].Count.N
                        return resolve(Number(userNumber));
                    }
                    else {
                        console.log('new day');
                        return resolve(userNumber)
                    }
                }
                else {
                    return resolve(userNumber)
                }
            })
            .catch(function (error) {
                return resolve(1);
            });
    })
}

let getTotalCount = (device) => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://3366oiq0z6.execute-api.eu-central-1.amazonaws.com/default/Storing_data_dynamodb', {
                "TableName": "QMS_Device",
                "Data": "",
                "Find": `${device}_App` //Device details goes here
            })
            .then(function (response) {
                let offlineNo = 0
                if (response.data.Data && response.data?.Data.length) {
                    let date = response.data.Data[0].Date_Time.S.split('/')[0]
                    if (date.toString().trim() == moment(new Date()).format('YYYY-MM-DD').toString().trim()) {
                        offlineNo = response.data.Data[0].Count.N
                        return resolve(Number(offlineNo));
                    }
                    else {
                        return resolve(offlineNo)
                    }
                }
                else {
                    return resolve(offlineNo)
                }
            })
            .catch(function (error) {
                return resolve(1);
            });
    })
}

let createDevice = (device) => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://t5aa275v2j.execute-api.eu-central-1.amazonaws.com/default/Smart_bell_lambda', {
                "Action": "create",
                "Device": device
            })
            .then(function (res) {
                console.log(`statusCode: ${res.status}`);
                //Certificate File Generation
                fs.writeFile(`./assets/deviceCreation/${device}_certificate.pem.crt`, res.data.files[0][device].certificatePem, function (err) {
                    if (err) throw err;
                    console.log('Saved certificate');
                });

                //Private Key File
                fs.writeFile(`./assets/deviceCreation/${device}_private.pem.key`, res.data.files[0][device].keyPair.PrivateKey, function (err) {
                    if (err) throw err;
                    console.log('Saved private key');
                });
                return resolve('saved!');
            })
            .catch(function (error) {
                console.log(error);
                return reject(error);
            });
    })
}

let sendDataToServer = (userDetails) => {
    // console.log('userDetails', userDetails);
    axios
        .post('https://3366oiq0z6.execute-api.eu-central-1.amazonaws.com/default/Storing_data_dynamodb', {
            "TableName": "QMS_Device",
            "Data": `[${userDetails.deviceName}_App, ${userDetails.timeStamp}, ${userDetails.count}, ${userDetails.name}, ${userDetails.contact}]`,
            // "Data": "[98298736963c6105659978, 2022-5-16/16:14:07, 6, name, contact]",
            "Find": "" //Device details goes here
        }).then(res => {
            console.log(`status: ${res.status}`);
        })
        .catch(err => console.log(err))
}

let getDeviceList = (user) => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://t5aa275v2j.execute-api.eu-central-1.amazonaws.com/default/Smart_bell_lambda', {
                "Device": user,
                "Action": "get_list"
            })
            .then(function (response) {
                if (response.data) {
                    return resolve(response?.data.files);
                }
            })
            .catch(function (error) {
                console.log(error);
                return reject(error);
            });
    })
}


module.exports = {
    getUserCount,
    createDevice,
    sendDataToServer,
    getDeviceList,
    getTotalCount,
}