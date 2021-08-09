const FormRecogniser = require("../models/FormRecogniser")
const recogniser = new FormRecogniser()

function routeConverter(app) {
    app.route('/converter')
    .post(recogniser.recognizeInvoices)

}
module.exports = {routeConverter}