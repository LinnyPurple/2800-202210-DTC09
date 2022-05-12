// Populate userinfo
async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    console.log(res);
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn == true) {
        console.log("User is logged in")
        var currentUsername = currentUserInfo.name;
        var currentUserEmail = currentUserInfo.email;
        // var currentUserLocation = currentUserInfo.location;

        if (currentUsername != null) {
            document.getElementById("nameInput").value = currentUsername;
        }

        if (currentUserEmail != null) {
        document.getElementById("emailInput").value = currentUserEmail;
        }

        // if (currentUserLocation != null) {
        //     document.getElementById("locationInput").value = currentUserLocation;
        //     }

    } else {
        console.log("No user is signed in");
        window.location.href = "./login.html";
    }
}

//enable the fields for value change
function editUserInfo() {
    document.getElementById("personalInfoFields").disabled = false
    document.getElementById("emailInput").disabled = true
}

// search function

//search end


// Todo: save -> update data
// function saveUserInfo(){
// userName = document.getElementById("nameInput").value;

//after
//document.getElementById('personalInfoFields').disabled = true
// }

// Todo: upload picture
// function upload_profile_picture() {

// }

// async function createAccountV2(username = "testuser", email = "testEmail", password = "testPass") {
//     let res = await postRequest("/api/createAccount", {
//         password: password,
//         username: username,
//         email: email,
//         accessLevel: 1
//     });
//     console.log(res);
// }

// async function login(username = "testuser") {
//     let res = await postRequest("/api/login", {
//         password: "testPass",
//         username: username
//     });
//     console.log(res);
// }

function setup() {
    getUserInfo()
}

$(document).ready(setup)