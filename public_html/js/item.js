var listingID = 0;
var traderID = "";

// get post ID from URL
function getPostID() {
    // create a URL object
    let params = new URL(window.location.href);
    listingID = params.searchParams.get("post_id");

    getListingData(listingID);
}

// check user's post or not
async function checkTwoUsers() {
    let res = await getRequest("/api/getUserInfo");
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn == true) {
        var currentUserID = currentUserInfo.uid;

        if(currentUserID == traderID){
            $('#tradeOrEdit').html('<button id="edit_btn" type="button" class="btn btn-lg" onclick="go_edit()">Edit</button>');
            $('#chat_btn').css('display','none');
        }

    } else {
        window.location.href = "/login";
    }
}

async function getTraderInfo() {
    let res = await getRequest(`/api/getTraderInfo?id=${encodeURIComponent(traderID)}`);
    var currentTraderInfo = JSON.parse(res);
    var traderName = currentTraderInfo.data.username;
    var tradersID = currentTraderInfo.data.ID;

    $('#traderName').html(traderName);
    $('#traderName').attr("href", `/traderinfo?trader_id=${tradersID}`);

    checkTwoUsers();
}

function go_edit() {
    window.location.href = "/editpost?post_id=" + listingID;
}

function go_chat() {
    window.location.href = "/chat/" + traderID;
}

function send_offer() {
    window.location.href = `/sendTradeOffer?post=${listingID}&trader=${traderID}`;
}

async function getListingData(listingID) {
    let res = await getRequest(`/api/getListingData?id=${encodeURIComponent(listingID)}`);
    var currentItemInfo = JSON.parse(res);
    var date = currentItemInfo.posted.split('T');

    $('#title_').html(currentItemInfo.title);
    $('#date').html(date[0]);

    if(currentItemInfo.images) {
        $("#item_image").attr("src", `../img/post/${currentItemInfo.images}`);
    }

    $('#myItem').html(currentItemInfo.myItemCategory);
    $('#itemLookfor').html(currentItemInfo.tradingItemCategory);
    $('#description').html(currentItemInfo.description);
    $('#condition').html(currentItemInfo.itemCondition);
    $('#trading_method').html(currentItemInfo.tradingMethod);

    traderID = currentItemInfo.posterID;
    getTraderInfo();
}

$(document).ready(() => {
  getPostID();
});
