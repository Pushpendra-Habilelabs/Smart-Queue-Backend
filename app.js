const express = require('express')
const app = express()
const http = require('http').Server(app);
const config = require('./config')
const useragent = require('express-useragent');
const cors = require('cors')
const path = require('path')
const { throwNotFoundError } = require('./errors')
const { PORT } = config;
const morgan = require('morgan')
const bodyParser = require('body-parser')
const rfs = require('rotating-file-stream')
const routes = require('./routes')
const awsIot = require('aws-iot-device-sdk');

let currentNumber = 0;

// const device = awsIot.device({
//     keyPath: 'assets/deviceCreation/puspendras20_Device3_Queue3_private.pem.key',
//     certPath: 'assets/deviceCreation/puspendras20_Device3_Queue3_certificate.pem.crt',
//     caPath: 'assets/currentCount/Q_AmazonRootCA1.pem',
//     clientId: 'qms_device',
//     host: 'a3n2130neve4if-ats.iot.eu-central-1.amazonaws.com'
// });

// device
//     .on('connect', function () {
//         console.log('connect');
//         device.subscribe('puspendras20_device5_queue5');
//     });

//printing json
// device
//     .on('message', function (topic, payload) {
//         var jsonobj = payload.toString();
//         var myObj = JSON.parse(jsonobj);
//         currentNumber = myObj.Count;
//         console.log('****currentNumber*****');
//         console.log(currentNumber);
//         console.log('***********************');
//     });

// create helper middleware so we can reuse server-sent events
const useServerSentEventsMiddleware = (req, res, next) => {
    let isConnected = false
    const deviceName = req.params.device
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const device = awsIot.device({
        keyPath: `assets/deviceCreation/${deviceName}_private.pem.key`,
        certPath: `assets/deviceCreation/${deviceName}_certificate.pem.crt`,
        caPath: 'assets/currentCount/Q_AmazonRootCA1.pem',
        clientId: 'qms_device',
        host: 'a3n2130neve4if-ats.iot.eu-central-1.amazonaws.com'
    });

    device
        .on('connect', function () {
            console.log('connect');
            device.subscribe(deviceName);
            // device.publish(deviceName, JSON.stringify({ test_data: 1}));
        });
    device
        .on('message', function (topic, payload) {
            var jsonobj = payload.toString();
            var myObj = JSON.parse(jsonobj);
            currentNumber = myObj.Count;
            console.log('****currentNumber*****');
            console.log(currentNumber);
            console.log('***********************');
        });

    // only if you want anyone to access this endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.flushHeaders();

    const sendEventStreamData = (data) => {
        const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
        res.write(sseFormattedResponse);
    }

    // we are attaching sendEventStreamData to res, so we can use it later
    Object.assign(res, {
        sendEventStreamData
    });
    next();
}

const streamRandomNumbers = (req, res) => {
    // We are sending anyone who connects to /stream-random-numbers
    // a random number that's encapsulated in an object
    let interval = setInterval(function generateAndSendRandomNumber() {
        res.sendEventStreamData(currentNumber);
    }, 1000);

    // close
    res.on('close', () => {
        clearInterval(interval);
        res.end();
    });
}

app.get('/current-token-number/:device', useServerSentEventsMiddleware,
    streamRandomNumbers)

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

app.use(useragent.express());
app.use(function (req, res, next) {
    // console.log('origin is : ', req.header('origin'), req.originalUrl)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Accept-Control-Allow-Origin', '*');
    req.headers['Accept-Encoding'] = 'gzip, deflate'
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    bodyParser.json({ limit: '1000mb' })(req, res, next);
});


app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }))
app.use(morgan('combined', { stream: accessLogStream }))
app.use(express.static(path.resolve(__dirname, '../build')))
app.use(express.static(path.join(__dirname, './public')))

/* Cors */
app.use(cors())

routes(app);

// catch 404 and forward to error handler
app.use((request, response) => {
    return throwNotFoundError(response, 'PAGE NOT FOUND')

    // response.redirect('404.html');
})

http.listen(PORT, function () {
    console.log(`server is listening on ${PORT}`);
});
