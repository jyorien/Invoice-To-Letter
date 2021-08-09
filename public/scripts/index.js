
function test() {
    var test = {"url":"https://i.imgur.com/CgkVGWF.png"}
    var xhr = new XMLHttpRequest()
    xhr.open("POST","/converter")
    xhr.onload = function() {
        console.log(xhr.responseText)
        console.log(xhr.responseType)
        console.log(xhr.getAllResponseHeaders)
        window.open("/converter")
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(test))
}