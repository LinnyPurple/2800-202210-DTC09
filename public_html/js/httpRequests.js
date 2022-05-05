function postRequest(url, data) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader('Content-type', 'application/json');

        xmlHttp.onload = function() {
            resolve(xmlHttp.response);
        }

        xmlHttp.send(JSON.stringify(data));
    });
}

function getRequest(url) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", url, true);
        xmlHttp.onload = function() {
            resolve(xmlHttp.response);
        }

        xmlHttp.send(null);
    });
}