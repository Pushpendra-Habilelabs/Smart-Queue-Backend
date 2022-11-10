const app = require('express')()
const config = require('./config')
const bodyParser = require('body-parser')
const cors = require('cors')

const { throwNotFoundError } = require('./errors')
const { PORT } = config;
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

routes(app);

/* Cors */
app.use(cors())
// catch 404 and forward to error handler
app.use((request, response) => {
    return throwNotFoundError(response, 'PAGE NOT FOUND')
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})