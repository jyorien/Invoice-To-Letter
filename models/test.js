const plshelp = []

const fuck = [{"items":
 {
     "0" : {
         "description": "FUCK YOU",
         "price":"$1000"

     },
     "1" : {
        "description": "FUCK YOU 1",
        "price":"$10001"

    },
}
}]

fuck.forEach(element => {

    element.items.forEach((value)=> {
        console.log(value)
    })
});

