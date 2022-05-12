async function createAccount(username = "testuser") {
    let res = await postRequest("/api/createAccount", {
        password: "testPass",
        username: username,
        email: "testEmail"
    });
    console.log(res);
}

async function createAccountV2(username = "testuser", email = "testEmail", password = "testPass") {
    let res = await postRequest("/api/createAccount", {
        password: password,
        username: username,
        email: email
    });
    console.log(res);
}

async function deleteAccount() {
    let res = await postRequest("/api/deleteAccount", {
        password: "testPass",
        username: "testUser",
        email: "testEmail"
    });
    console.log(res);
}
async function login(username = "testuser") {
    let res = await postRequest("/api/login", {
        password: "testPass",
        username: username
    });
    console.log(res);
}

async function logout() {
    let res = await getRequest("/api/logout");
    console.log(res);
}

async function loginV2(username = "testuser", password = "testPass") {
    let res = await postRequest("/api/login", {
        password: password,
        username: username
    });
    console.log(res);
}

async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    console.log(res);
}
async function getOtherUserInfo(id) {
    let res = await getRequest(`/api/getUserInfo?uid=${id}`);
    console.log(res);
}
async function postListing() {
    let res = await postRequest("/api/postListing", {
        title: "Test Title",
        description: "This is a test description for posting listings."
    });
    console.log(res);
}
async function archiveListing(arhivePostID) {
    let res = await postRequest("/api/archiveListing", {
        postID: arhivePostID
    });
    console.log(res);
}
async function getListingData(listingID) {
    let res = await getRequest(`/api/getListingData?id=${encodeURIComponent(listingID)}`);
    console.log(res);
}

async function sendReview(reviewee, reviewText, score) {
    let res = await postRequest('/api/postReview', {
        reviewee: reviewee,
        reviewText: reviewText,
        score: score
    });
    console.log(res);
}

async function deleteReview(reviewee) {
    let res = await postRequest('/api/deleteReview', {
        reviewee: reviewee,
    });
    console.log(res);
}

async function getReview(reviewer, reviewee) {
    let res = await getRequest(`/api/getReview?reviewer=${encodeURIComponent(reviewer)}&reviewee=${encodeURIComponent(reviewee)}`);
    console.log(res);
}

async function getReviews(reviewee) {
    let res = await getRequest(`/api/getReviews?reviewee=${encodeURIComponent(reviewee)}`);
    console.log(res);
}

async function promoteAccount(accountID, level) {
    let res = await postRequest('/api/admin/promoteAccount', {
        toPromote: accountID,
        newAccessLevel: level
    });
    console.log(res);
}

async function adminGetAccounts() {
    let res = await getRequest('/api/admin/getUserList');
    console.log(res);
}