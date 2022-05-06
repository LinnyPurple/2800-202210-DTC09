async function createAccount(username = "testuser") {
    let res = await postRequest("/api/createAccount", {
        password: "testPass",
        username: username,
        email: "testEmail",
        accessLevel: 1
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