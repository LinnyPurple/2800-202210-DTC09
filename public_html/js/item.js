// check user logged in
async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    console.log(res);
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn == true) {
        console.log("User is logged in")

    } else {
        console.log("No user is signed in");
        window.location.href = "/login";
    }
}

async function login(username) {
    let res = await postRequest("/api/login", {
        password: "a",
        username: username
    });
    console.log(res);
}

function setup() {
    login("a")
    getUserInfo()
}

$(document).ready(setup)