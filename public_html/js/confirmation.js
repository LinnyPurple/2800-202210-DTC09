var offerID = 0;
var traderID = 0;
var traderPostID = 0;
var myPostID = 0;


// get trade ID and other trader ID from URL
function getTradeInfo()  {
    // create a URL object
    let params = new URL(window.location.href);
    offerID = params.searchParams.get("offerID");
    traderID = params.searchParams.get("traderID");

    getOfferByid()
}

async function getOfferByid() {
    let res = await postRequest("/api/getOfferByid", {
        offerID: offerID
    });

    let offerInfo = JSON.parse(res).data

    if(traderID == offerInfo.offereeID) {
        traderPostID = offerInfo.offereeListingID;
        myPostID = offerInfo.offererListingID;
    } else {
        traderPostID = offerInfo.offererListingID;
        myPostID = offerInfo.offereeListingID;
    }
    console.log(traderPostID)
    console.log(myPostID)
    changeArchieve()
}

async function changeArchieve() {
    let res = await postRequest("/api/archiveListing", {
        postID: myPostID
    });
    console.log(res);
}

function goReview() {
    window.location.href =`/review?postID=${traderPostID}&traderID=${traderID}`
}

function setup() {
    getTradeInfo()
}

$(document).ready(setup)