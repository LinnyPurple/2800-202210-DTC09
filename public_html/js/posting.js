// check user logged in
async function getUserInfo() {
    let res = await getRequest("/api/getUserInfo");
    var currentUserInfo = JSON.parse(res);

    // Check user is logged in
    if (currentUserInfo.loggedIn == true) {
        console.log("User is logged in");
    } else {
        window.location.href = "/login";
    }
}

// upload picture
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var re = /data:(.*);/;
            var image_type = re.exec(e.target.result)[1];
            console.log(`Data type: ${image_type}`);
            console.log(`Data is image/png or image/jpeg: ${image_type === "image/png" || image_type === "image/jpeg"}`);
            if (image_type === "image/png" || image_type === "image/jpeg") $('#imageResult').attr('src', e.target.result);
            else {
                console.log("INVALID FILE TYPE");
                $('#imageResult').attr('src', "/img/default/camera.svg");
                $("#invalid-file-type").html("Invalid file type. Must upload an image.");
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

var input = document.getElementById('upload');
var infoArea = document.getElementById('upload-label');

input.addEventListener('change', showFileName);

function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = 'File name: ' + fileName;
}

$(document).ready(() => {
    getUserInfo();
});
