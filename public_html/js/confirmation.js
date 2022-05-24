var offerID = 0;
var traderID = 0;


// get trade ID and other trader ID from URL
function getTradeInfo()  {
    // create a URL object
    let params = new URL(window.location.href);
    offerID = params.searchParams.get("offerID");
    traderID = params.searchParams.get("traderID");

    getUserInfo()
}

function goReview() {
    window.location.href =`/review?offerID=${offerID}&traderID=${traderID}`
}

function setup() {
    getTradeInfo() 
}

$(document).ready(setup)