// check user logged in
// async function getUserInfo() {
//     let res = await getRequest("/api/getUserInfo");
//     console.log(res);
//     var currentUserInfo = JSON.parse(res);

//     // Check user is logged in
//     if (currentUserInfo.loggedIn == true) {
//         console.log("User is logged in")
//         //function name!!!

//     } else {
//         console.log("No user is signed in");
//         window.location.href = "/login";
//     }
// }

async function login(username) {
    let res = await postRequest("/api/login", {
        password: "a",
        username: username
    });
    console.log(res);
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

var input = document.getElementById('upload');
var infoArea = document.getElementById('upload-label');

input.addEventListener('change', showFileName);

function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = 'File name: ' + fileName;
}

// submit posting
async function postListing() {
    var thisTitle = $('#titleInput').val();
    var myItemCategory = $('#myCategory :selected').val();
    var TradingItemCategory = $('#wantedCategory :selected').val();
    var condition = $('#condition :selected').val();
    var tradingMethod = $('#tradingMethod :selected').val();
    var description = $('#description').val();

    console.log(thisTitle)
    console.log(myItemCategory)
    console.log(TradingItemCategory)
    console.log(condition)
    console.log(tradingMethod)
    console.log(description)

    let res = await postRequest("/api/postListing", {
        title: thisTitle,
        myItem: myItemCategory,
        tradingItem: TradingItemCategory,
        condition: condition,
        tradingMethod: tradingMethod,
        description: description
    });
    console.log(res);
}


function setup() {
    getUserInfo()
}

$(document).ready(setup)