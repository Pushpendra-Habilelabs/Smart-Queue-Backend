const axios = require('axios');
var fs = require('fs');
const moment = require('moment');

let getUserCount = () => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://3366oiq0z6.execute-api.eu-central-1.amazonaws.com/default/Storing_data_dynamodb', {
                "TableName": "QMS_Device",
                "Data": "",
                "Find": "sahilshop1_9829873696_App" //App details goes here
            })
            .then(function (response) {
                let userNumber = 0
                if (response.data.Data && response.data?.Data.length) {
                    let date = response.data.Data[0].Date_Time.S.split('/')[0]
                    if (date.toString().trim() == moment(new Date()).format('YYYY-M-DD').toString().trim()) {
                        userNumber = response.data.Data[0].Count.N
                        return resolve(Number(userNumber));
                    }
                    else {
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

let getOfflineCount = () => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://3366oiq0z6.execute-api.eu-central-1.amazonaws.com/default/Storing_data_dynamodb', {
                "TableName": "QMS_Device",
                "Data": "",
                "Find": "sahilshop1_9829873696_Device" //Device details goes here
            })
            .then(function (response) {
                if (response.data) {
                    let offlineNumber = response.data.Data[0]?.Count.N
                    return resolve(offlineNumber);
                }
            })
            .catch(function (error) {
                console.log(error);
                return reject(error);
            });
    })
}

let createDevice = (device) => {
    return new Promise((resolve, reject) => {
        axios
            .post('https://t5aa275v2j.execute-api.eu-central-1.amazonaws.com/default/Smart_bell_lambda', {
                "Device": device //Device Name goes here
            })
            .then(function (res) {
                console.log(`statusCode: ${res.status}`);
                //Certificate File Generation
                fs.writeFile('./assets/deviceCreation/certificate.pem.crt', res.data.files[0][device].certificatePem, function (err) {
                    if (err) throw err;
                    console.log('Saved certificate');
                });

                //Private Key File
                fs.writeFile('./assets/deviceCreation/private.pem.key', res.data.files[0][device].keyPair.PrivateKey, function (err) {
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

module.exports = {
    getUserCount,
    getOfflineCount,
    createDevice,
    sendDataToServer,
}