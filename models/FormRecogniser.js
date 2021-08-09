require('dotenv').config({path: '../.env'})
const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const PDFDocument = require('pdfkit')
const archiver = require("archiver")

// create .env file and define 'ENDPOINT' and 'API_KEY'
const ENDPOINT = process.env.ENDPOINT
const API_KEY = process.env.API_KEY

const path = "./images/word-invoice-template.png"
const client = new FormRecognizerClient(ENDPOINT, new AzureKeyCredential(API_KEY))

class FormRecogniser {

    async recognizeInvoices(req,res) {

        var url = req.body.url
        console.log("url in body:",url)

        const poller = await client.beginRecognizeInvoicesFromUrl(url, {
            onProgress: (state) => {
                console.log(`status: ${state.status}`);
            }
        });
    
        const [invoice] = await poller.pollUntilDone();
        if (invoice === undefined) {
            throw new Error("Failed to extract data from at least one invoice.");
        }
    
        // Helper function to print fields.
        // function fieldToString(field) {
        //     const {
        //         name,
        //         valueType,
        //         value,
        //         confidence
        //     } = field;
        //     return `${name} (${valueType}): '${value}' with confidence ${confidence}'`;
        // }
    
    
        // console.log("Invoice fields:");
        var itemJsonResponse = {}
    
    
        // for (const [name, field] of Object.entries(invoice.fields)) {
        //     if (field.valueType !== "array" && field.valueType !== "object") {
        //         console.log(`- ${name} ${fieldToString(field)}`);
        //     }
        // }
    
        let idx = 0;
    
        console.log("- Items:");
    
        const items = invoice.fields["Items"]?.value;
        for (const item of items ?? []) {
            const value = item.value;
        itemJsonResponse[idx] = {}
    
            const subFields = [
                "Description",
                "Quantity",
                "Unit",
                "UnitPrice",
                "ProductCode",
                "Date",
                "Tax",
                "Amount"
            ]
            var filteredFields = subFields.filter((field) => value[field] !== undefined)
        
            filteredFields.forEach((val) => {
                const list = itemJsonResponse[idx]
                list[val] = value[val]["valueData"]["text"]
            })
                    
            idx+=1
        }
        console.log(itemJsonResponse)
        dataToInvoice(itemJsonResponse)

        function dataToInvoice(jsonData) {
            var filteredData = Object.values(jsonData).map((value) => {
                return {
                    "Description": value.Description,
                    "Amount": value.Amount
                }
            })
            var index = 0
            filteredData.forEach((value) => {
                var template = `Dear Sir/Mam, we would like to request a payment of $${value.Amount} for ${value.Description}`
                console.log("template",template)
                // create document
                const doc = new PDFDocument()

                doc.pipe(fs.createWriteStream(`files/output${index}.pdf`))
                doc
                    .fontSize(25)
                    .text(template)  
                    .end()
                    index+=1       
            })

            const output = fs.createWriteStream(`files/letters.zip`)
            const archive = archiver('zip', {zlib: {level:9}})
            output.on('close',()=>{
                // on stream close
                console.log("closed")
                res.download(`files/letters.zip`)
            
            
            })
            for (let i = 0; i < index; i++) {
                archive.file(`files/output${i}.pdf`,{name: `files/output${i}.pdf`})
            }
            archive.finalize()
            archive.pipe(output)


            

        }
        // res.setHeader('Content-Type', 'application/json');
        // res.send(itemJsonResponse)
    
    }
    
    
}
module.exports = FormRecogniser

