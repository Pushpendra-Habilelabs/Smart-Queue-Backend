const { createLogger, format, transports, addColors } = require('winston');
const { combine, timestamp, label } = format;
const path = require('path')
const errorLogFile = path.join(__dirname, '../log/error.log')

addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green'
});

const logger = createLogger({
    format: combine(
        timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({
            filename: errorLogFile,
            colorize: true,
            timestamp: function () {
                return (new Date()).toLocaleTimeString();
            },
            prettyPrint: true
        }),
    ]
});

module.exports = logger