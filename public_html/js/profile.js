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
        var currentImage = currentUserInfo.image;
        console.log(currentUserInfo)

        if (currentUsername != '') {
            document.getElementById("nameInput").value = currentUsername;
        }

        if (currentUserEmail != '') {
            document.getElementById("emailInput").value = currentUserEmail;
        }

        if (currentImage != "") {
            $("#profilePicture").html(`<img src="${currentImage}" class="rounded-circle border border-dark border-1 mx-auto d-block" style="width: 110px; height: 110px;">`)
        }

    } else {
        console.log("No user is signed in");
        window.location.href = "/login";
    }
}

//enable the fields for value change
function editUserInfo() {
    document.getElementById("personalInfoFields").disabled = false
    document.getElementById("emailInput").disabled = true
}


// save -> update data
async function saveUserInfo() {
    userName = document.getElementById("nameInput").value;
    userPassword = document.getElementById("passwordInput").value;

    let res = await postRequest("/api/editAccount2", {
        newUsername: userName,
        newPassword: userPassword
    });
    console.log(res);

    // after
    document.getElementById('personalInfoFields').disabled = true
}

function setup() {
    getUserInfo()
}

$(document).ready(setup)