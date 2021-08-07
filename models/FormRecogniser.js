require('dotenv').config({path: '../.env'})
const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");

// create .env file and define 'ENDPOINT' and 'API_KEY'
const ENDPOINT = process.env.ENDPOINT
const API_KEY = process.env.API_KEY

const client = new FormRecognizerClient(ENDPOINT, new AzureKeyCredential(API_KEY))

const path = "./images/word-invoice-template.png"
const readStream = fs.createReadStream(path)

class FormRecogniser {
    async recognizeInvoices(req,res) {

        const poller = await client.beginRecognizeInvoices(readStream, {
            onProgress: (state) => {
                console.log(`status: ${state.status}`);
            }
        });
    
        const [invoice] = await poller.pollUntilDone();
        if (invoice === undefined) {
            throw new Error("Failed to extract data from at least one invoice.");
        }
    
        // Helper function to print fields.
        function fieldToString(field) {
            const {
                name,
                valueType,
                value,
                confidence
            } = field;
            return `${name} (${valueType}): '${value}' with confidence ${confidence}'`;
        }
    
    
        console.log("Invoice fields:");
        var itemJsonResponse = {}
    
    
        for (const [name, field] of Object.entries(invoice.fields)) {
            if (field.valueType !== "array" && field.valueType !== "object") {
                console.log(`- ${name} ${fieldToString(field)}`);
            }
        }
    
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
                // .map((fieldName) => value[fieldName])
    
            var filteredFields = subFields.filter((field) => value[field] !== undefined)
        
            filteredFields.forEach((val) => {
                console.log(val)
                console.log(value[val]["valueData"]["text"])
                const list = itemJsonResponse[idx]
                list[val] = value[val]["valueData"]["text"]
                // value[`${value[val]["valueData"]["text"]}`
            })
            
        
    
                
            // console.log(
            //     [
            //         `  - Item #${idx}`,
            //         // Now we will convert those fields into strings to display
            //         ...subFields.map((field) => `    - ${fieldToString(field)}`)
            //     ].join("\n")
            // );
            
            idx+=1
        }
        console.log(itemJsonResponse)
        res.setHeader('Content-Type', 'application/json');
        res.send(itemJsonResponse)
    
    }
    
    // recognizeInvoices().catch((err) => {
    //     console.error("The sample encountered an error:", err);
    // });
}
module.exports = FormRecogniser

