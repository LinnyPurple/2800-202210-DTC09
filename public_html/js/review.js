// Todo: Should be changed!!
var revieweeID = 30;
var itemID = Math.floor(Math.random() * 100);


let ratingNum = 0;

function rating(src) {
    ratingNum = src.value;
    console.log(ratingNum)
}

async function sendReview() {
    var reviewee = revieweeID;
    var score = ratingNum;
    var reviewText = document.getElementById("comment").value;
    if (ratingNum != 0) {
        let res = await postRequest('/api/postReview', {
            reviewee: reviewee,
            reviewText: reviewText,
            score: score,
            itemID: itemID
        });
        console.log(res);
    } else{
        alert("Please rate your trade :)")
    }
}

async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    console.log(res);
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn) {
        console.log("User is logged in")
    } else {
        console.log("No user is signed in");
        window.location.href = "/login";
    }
}

function setup() {
    getUserInfo()
}

$(document).ready(setup)