// check user logged in
async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    console.log(res);
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn == true) {
        console.log("User is logged in")
        //function name!!!

    } else {
        console.log("No user is signed in");
        window.location.href = "/login";
    }
}

// upload picture
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

var input = document.getElementById( 'upload' );
var infoArea = document.getElementById( 'upload-label' );

input.addEventListener( 'change', showFileName );
function showFileName( event ) {
  var input = event.srcElement;
  var fileName = input.files[0].name;
  infoArea.textContent = 'File name: ' + fileName;
}

function setup() {
    getUserInfo()
}

$(document).ready(setup)