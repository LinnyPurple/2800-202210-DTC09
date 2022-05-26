var traderID = "";

// get trader ID from URL
function gettraderID() {
    // create a URL object
    let params = new URL(window.location.href);
    traderID = params.searchParams.get("trader_id");

    getTraderInfo();
    getTraderhistory();
    getTraderReview();
}

async function getTraderInfo() {
    let res = await getRequest(`/api/getTraderInfo?id=${encodeURIComponent(traderID)}`);
    var currentTraderInfo = JSON.parse(res);
    // console.log(currentTraderInfo);

    var traderName = currentTraderInfo.data.username;
    var traderEmail = currentTraderInfo.data.email;
    var currentImage = currentTraderInfo.data.image;

    $('.traderName').html(traderName);
    $('#traderEmail').html(traderEmail);
    if (currentImage) {
        $("#profilePicture").html(`<img src="${currentImage}" class="rounded-circle border border-dark border-1 mx-auto d-block" style="width: 110px; height: 110px;">`);
    }
}

async function getTraderhistory() {
    let res = await getRequest(`/api/getListingsFromUser/${traderID}`);
    var currentTraderhistroy = JSON.parse(res);
    // console.log(currentTraderhistroy);

    let itemImage = "";
    let histories = "";

    // Store all user's history posting in variable histories
    if (currentTraderhistroy) {
        for (let i = 0; i < currentTraderhistroy.length; i++) {
            if (currentTraderhistroy[i].images) {
                itemImage = "../img/post/" + currentTraderhistroy[i].images;
            } else {
                itemImage = "../etc/camera.svg";
            }

            histories += `<div class="each_history">
        <img class="fa-solid fa-circle-user" src="${itemImage}">
        <a href="item?post_id=${currentTraderhistroy[i].ID}">${currentTraderhistroy[i].title}</a></div>`;
        }
    }

    $('#histroy_section').html(histories);
}

async function getTraderReview() {
    let res = await getRequest(`/api/getReviews?reviewee=${encodeURIComponent(traderID)}`);

    var currentTraderReviews = JSON.parse(res).data;
    // console.log(currentTraderReviews)

    let reviews = "";

    // Store all user's reviews in variable reviews
    if (currentTraderReviews) {
        for (let j = 0; j < currentTraderReviews.length; j++) {

            let rating = '⭐️ '.repeat(currentTraderReviews[j].score);

            // get reviewer's name from database
            let reviewer_res = await getRequest(`/api/getTraderInfo?id=${encodeURIComponent(currentTraderReviews[j].reviewerID)}`);
            let reviewerInfo = JSON.parse(reviewer_res);
            let reviewerName = reviewerInfo.data.username;

            reviews += `<li class="each_review">
            <a href="/traderinfo?trader_id=${currentTraderReviews[j].reviewerID}"> ${reviewerName} </a>
            <span class="stars">${rating}</span>
            <div class="reviewText">
                ${currentTraderReviews[j].reviewText}
            </div></li>`;
        }
    }

    $('#reviews_section').html(reviews);
}

function setup() {
    gettraderID();
}

$(document).ready(setup);
