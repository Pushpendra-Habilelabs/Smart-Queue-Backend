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

let currentNumber = 1;


const device = awsIot.device({
    keyPath: 'assets/currentCount/Q_private.pem.key',
    certPath: 'assets/currentCount/Q_certificate.pem.crt',
    caPath: 'assets/currentCount/Q_AmazonRootCA1.pem',
    clientId: 'qms_device',
    host: 'a3n2130neve4if-ats.iot.eu-central-1.amazonaws.com'
});

//
// Device is an instance returned by mqtt.Client(z), see mqtt.js for full
// documentation.
//

//connection acknowledgement
device
    .on('connect', function () {
        console.log('connect');
        device.subscribe('sahilshop1_9829873696');
    });

//printing json
device
    .on('message', function (topic, payload) {
        var jsonobj = payload.toString();
        var myObj = JSON.parse(jsonobj);
        currentNumber = myObj.Count;
        console.log('****currentNumber*****');
        console.log(currentNumber);
        console.log('***********************');
    });



// Initialize wifi module
// Absolutely necessary even to set interface to null
// wifi.init({
//     iface: null // network interface, choose a random wifi interface if set to null
// });

// // Connect to a network
// wifi.connect({ ssid: 'Sahil', password: '12345678' }, () => {
//     console.log('Wifi Connected');
//     // on windows, the callback is called even if the connection failed due to netsh limitations
//     // if your software may work on windows, you should use `wifi.getCurrentConnections` to check if the connection succeeded
// });


// create helper middleware so we can reuse server-sent events
const useServerSentEventsMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

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

app.get('/current-token-number', useServerSentEventsMiddleware,
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
