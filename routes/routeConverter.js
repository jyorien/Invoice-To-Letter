const FormRecogniser = require("../models/FormRecogniser")
const recogniser = new FormRecogniser()

function routeConverter(app) {
    app.route('/converter')
    .post(recogniser.recognizeInvoices)
    .get(recogniser.downloadLetters)

    app.route('/test')
    .get((req,res)=>{
        var testJson = {
            "y3llo": "there"
        }
        res.send(testJson)
    })
}
module.exports = {routeConverter}