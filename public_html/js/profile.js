// Todo: Populate userinfo
// async function getUserInfo() {
//     let res = await getRequest("/api/getUserInfo");
//     console.log(res);
// }

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

function setup() {
    // getUserInfo()
}

$(document).ready(setup)