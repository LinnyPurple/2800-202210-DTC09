async function populateOffers(recieving=true) {
    // get all my offers
    let res = JSON.parse(await getRequest('/api/getTradeOffersFromMe'));
    console.log(res)
    const parent = document.querySelector("#OfferContainer");

    // populate all offers
    for (let offerInd in res.data) {
        let template = document.querySelector("#OfferTemplate").content.cloneNode(true);
        let offer = res.data[offerInd];

        // get other trade's information
        let offeree = JSON.parse(await getOtherUserInfo(offer.offereeID));

        // get two itmes information
        let offererData = JSON.parse(await getRequest(`/api/getListingData?id=${encodeURIComponent(offer.offererListingID)}`));
        let offereeData = JSON.parse(await getRequest(`/api/getListingData?id=${encodeURIComponent(offer.offereeListingID)}`));

        // store images in variables
        let offererImg;
        let offereeImg;
        if (!offererData.images) {
            offererImg = '/etc/camera.svg'
        } else {
            offererImg = `/img/post/${offererData.images}`
        }
        if (!offereeData.images) {
            offereeImg = '/etc/camera.svg'
        } else {
            offereeImg = `/img/post/${offereeData.images}`
        }
        template.querySelector(".OffereePicture").setAttribute('src', offeree.image ? offeree.image : '/etc/person-circle.svg');
        template.querySelector(".OffereeName").innerHTML = offeree.username;
        template.querySelector(".TradeOfferer").href = `/traderinfo?trader_id=${offer.offereeID}`;

        template.querySelector(".OfferName").innerHTML = "Your: " + offererData.title;
        template.querySelector(".OfferImg").setAttribute('src', offererImg);
        template.querySelector(".OfferItem").href = `/item?post_id=${offererData.ID}`;

        template.querySelector(".ForName").innerHTML = "Their: " + offereeData.title;
        template.querySelector(".ForImg").setAttribute('src', offereeImg);
        template.querySelector(".ForItem").href = `/item?post_id=${offereeData.ID}`;

        template.querySelector('.statusM').innerHTML = (offer.status == -1 ? "Pending" : (offer.status == 1 ? "Accepted" : "Declined"));
        template.querySelector('.chat_btn').setAttribute('onclick', `window.location.assign('/chat/${offer.offereeID}')`);

        parent.appendChild(template);
    }
}

async function tradeReply(offerID, traderID, accept) {
    let confirmation = confirm(`Do you want to ${accept ? 'accept' : 'decline'} trade?`)

    if (confirmation) {
        let res = JSON.parse(await postRequest('/api/replyTradeOffer', {
            'offerID': offerID,
            'accepted': (accept ? 1 : 0)
        }));
        console.log(res);
        if (res.msg == "Accepted trade offer.") {
            alert(res.msg)
            window.location.href = `/confirmation?offerID=${offerID}&traderID=${traderID}`;
        } else {
            alert(res.msg)
            location.reload();
        }
    }
}

populateOffers();