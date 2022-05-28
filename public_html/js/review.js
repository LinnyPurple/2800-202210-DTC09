var postID = 0;
var revieweeID = 0;

// get trade ID and other trader ID from URL
function getTradeInfo() {
    // create a URL object
    let params = new URL(window.location.href);
    postID = params.searchParams.get("postID");
    revieweeID = params.searchParams.get("traderID");

    getUserInfo();
}

// get user info
async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn) {
        console.log("User is logged in");
    } else {
        console.log("No user is signed in");
        window.location.href = "/login";
    }
}

// get rating number from user input
let ratingNum = 0;

function rating(src) {
    ratingNum = src.value;
}

// send review when user click submit button
async function sendReview() {
    var reviewee = revieweeID;
    var score = ratingNum;
    var reviewText = document.getElementById("comment").value;
    if (ratingNum != 0) {
        let res = await postRequest('/api/postReview', {
            reviewee: reviewee,
            reviewText: reviewText,
            score: score,
            postID: postID
        });
        alert('Thank you for your review!');
        window.location.href ='/';
    } else{
        alert("Please rate your trade :)");
    }
}

$(document).ready(() => {
    getTradeInfo();
});
