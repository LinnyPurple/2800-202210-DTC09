// Todo: get ID from URL
var listingID = 0;

// get group ID from URL
function getPostID() {
    // create a URL object
    let params = new URL(window.location.href);
    listingID = params.searchParams.get("post_id");

    getListingData();
}

// get previous item information
async function getListingData() {
    let res = await getRequest(`/api/getListingData?id=${encodeURIComponent(listingID)}`);
    var currentItemInfo = JSON.parse(res);

    if(currentItemInfo.images) {
        $("#imageResult").attr("src", `../img/post/${currentItemInfo.images}`);
    }
    $('#postID').val(currentItemInfo.ID);
    $('#titleInput').val(currentItemInfo.title);
    $('#myCategory').val(currentItemInfo.myItemCategory);
    $('#wantedCategory').val(currentItemInfo.tradingItemCategory);
    $('#condition').val(currentItemInfo.itemCondition);
    $('#tradingMethod').val(currentItemInfo.tradingMethod);
    $('#description').val(currentItemInfo.description);
}

// upload picture
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult').attr('src', e.target.result);
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
  getPostID();
});
