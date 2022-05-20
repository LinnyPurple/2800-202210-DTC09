// Todo: get ID from URL
var listingID = 2;
var traderID = '';

// get post ID from URL
function getPostID() {
    // create a URL object
    let params = new URL(window.location.href);
    listingID = params.searchParams.get("post_id");

    getListingData(listingID)
}


// check user's post or not
async function checkTwoUsers() {
    let res = await getRequest("/api/getUserInfo");
    // console.log(res);
    var currentUserInfo = JSON.parse(res);
    console.log(currentUserInfo)

    // Check user is logged in
    if (currentUserInfo.loggedIn == true) {
        console.log("User is logged in")
        var currentUserID = currentUserInfo.uid;

        if(currentUserID == traderID){
            $('#chatOrEdit').html('<button id="chat_btn" type="button" class="btn btn-secondary btn-lg" onclick="go_edit()">Edit</button>')
        }

    } else {
        console.log("No user is signed in");
        // window.location.href = "/login";
    }
}

async function getTraderInfo() {
    let res = await getRequest(`/api/getTraderInfo?id=${encodeURIComponent(traderID)}`);
    // console.log(res);
    var currentTraderInfo = JSON.parse(res);
    var traderName = currentTraderInfo.data.username;

    $('#traderName').html(traderName);

    checkTwoUsers();
}

function go_edit() {
    window.location.href = "/editpost?post_id=" + listingID;
}

function go_chat() {
    window.location.href = "/chat/" + traderID;
}

async function getListingData(listingID) {
    let res = await getRequest(`/api/getListingData?id=${encodeURIComponent(listingID)}`);
    // console.log(res);
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

    traderID = currentItemInfo.posterID
    getTraderInfo()
}

function setup() {
    getPostID()
}

$(document).ready(setup)