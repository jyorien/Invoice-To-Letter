require('dotenv').config()
const Express = require('express')
const routeConverter = require("./routes/routeConverter")
const bodyParser = require("body-parser")



const app = Express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routeConverter.routeConverter(app)

app.listen(port, ()=> {console.log(`App listening at http://localhost:${port}`)})

