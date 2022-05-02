function postRequest(url, data) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader('Content-type', 'application/json');

        xmlHttp.send(JSON.stringify(data));
        xmlHttp.onload = function() {
            resolve(xmlHttp.response);
        }
    });
}