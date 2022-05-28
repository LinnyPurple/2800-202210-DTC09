async function createAccount(username = "testuser") {
    let res = await postRequest("/api/createAccount", {
        password: "testPass",
        username: username,
        email: "testEmail"
    });
}

async function createAccountV2(username = "testuser", email = "testEmail", password = "testPass") {
    let res = await postRequest("/api/createAccount", {
        password: password,
        username: username,
        email: email
    });
}

async function deleteAccount() {
    let res = await postRequest("/api/deleteAccount", {
        password: "testPass",
        username: "testUser",
        email: "testEmail"
    });
}

async function deleteAccountV2(username = "testuser", email = "testEmail", password = "testPass") {
    let res = await postRequest("/api/deleteAccount", {
        password: password,
        username: username,
        email: email
    });
    return res;
}

async function login(username = "testuser") {
    let res = await postRequest("/api/login", {
        password: "testPass",
        username: username
    });
}

// async function logout() {
//     let res = await getRequest("/api/logout");
//     console.log(res);
//     window.location.assign('/login');
// }

async function loginV2(username = "testuser", password = "testPass") {
    let res = await postRequest("/api/login", {
        password: password,
        username: username
    });
    return res;
}

async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    return res;
}
async function getOtherUserInfo(id) {
    let res = await getRequest(`/api/getUserInfo?uid=${id}`);
    return res;
}
async function getOtherUserInfoByName(username) {
    let res = await getRequest(`/api/getUserInfo?username=${username}`);
    return res;
}
async function postListing() {
    let res = await postRequest("/api/postListing", {
        title: "Test Title",
        description: "This is a test description for posting listings."
    });
}
async function archiveListing(arhivePostID) {
    let res = await postRequest("/api/archiveListing", {
        postID: arhivePostID
    });
}
async function getListingData(listingID) {
    let res = await getRequest(`/api/getListingData?id=${encodeURIComponent(listingID)}`);
}

async function sendReview(reviewee, reviewText, score) {
    let res = await postRequest('/api/postReview', {
        reviewee: reviewee,
        reviewText: reviewText,
        score: score
    });
}

async function deleteReview(reviewee) {
    let res = await postRequest('/api/deleteReview', {
        reviewee: reviewee,
    });
}

async function getReview(reviewer, reviewee) {
    let res = await getRequest(`/api/getReview?reviewer=${encodeURIComponent(reviewer)}&reviewee=${encodeURIComponent(reviewee)}`);
}

async function getReviews(reviewee) {
    let res = await getRequest(`/api/getReviews?reviewee=${encodeURIComponent(reviewee)}`);
}

async function promoteAccount(accountID, level) {
    let res = await postRequest('/api/admin/promoteAccount', {
        toPromote: accountID,
        newAccessLevel: level
    });
}

async function adminGetAccounts() {
    let res = await getRequest('/api/admin/getUserList');
    return res;
}

async function searchListings(query) {
    let res = await getRequest(`/api/searchListings?s=${encodeURIComponent(query)}`);
    return res;
}

async function resetPassword(uid, newPassword) {
    let res = await postRequest('/api/resetPassword', {
        userId: uid,
        newPassword: newPassword
    });
}
