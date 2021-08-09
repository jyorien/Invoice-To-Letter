require('dotenv').config()
const Express = require('express')
const routeConverter = require("./routes/routeConverter")
const bodyParser = require("body-parser")
const startPage = "index.html"


const app = Express()
const port = process.env.PORT || 3000
app.use(Express.static("./public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routeConverter.routeConverter(app)

function gotoIndex(req, res) {
    console.log(req.params);
    res.sendFile(__dirname + "/" + startPage);
}

app.get("/" + startPage, gotoIndex);

app.route("/");

app.listen(port, ()=> {console.log(`App listening at http://localhost:${port}`)})

