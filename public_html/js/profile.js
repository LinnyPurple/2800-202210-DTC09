// Populate userinfo
async function getProfileInfo() {
    let res = await getRequest("/api/getUserInfo");
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn == true) {
        var currentUsername = currentUserInfo.name;
        var currentUserEmail = currentUserInfo.email;
        var currentImage = currentUserInfo.image ? currentUserInfo.image : '/img/default/person-circle.svg';

        if (currentUsername != '') {
            document.getElementById("nameInput").value = currentUsername;
        }
        if (currentUserEmail != '') {
            document.getElementById("emailInput").value = currentUserEmail;
        }
        $("#profilePicture").html(`<img src="${currentImage}" class="rounded-circle border border-dark border-1 mx-auto d-block" style="width: 110px; height: 110px;">`);

    } else {
        window.location.href = "/login";
    }
}

//enable the fields for value change
function editUserInfo() {
    document.getElementById("personalInfoFields").disabled = false;
    document.getElementById("emailInput").disabled = true;
}

// reset password
async function resetPassword(newPassword) {
    let res = await postRequest('/api/resetPassword', {
        newPassword: newPassword
    });
    console.log(res);
}

// save -> update data
async function saveUserInfo() {
    userName = document.getElementById("nameInput").value;
    userPassword = document.getElementById("passwordInput").value;

    if (userName == "") {
        alert('Please enter your name.');
    } else {
        let res = await postRequest("/api/editAccount2", {
            newUsername: userName,
        });

        if (userPassword != "") {
            resetPassword(userPassword);
        }
        // after
        document.getElementById('personalInfoFields').disabled = true;
    }
}

$(document).ready(() => {
    getProfileInfo();
});
