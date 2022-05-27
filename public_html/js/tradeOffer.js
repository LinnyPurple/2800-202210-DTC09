async function populateOffers() {
    // get all my offers
    let res = JSON.parse(await getRequest('/api/getTradeOffersToMe'));
    const parent = document.querySelector("#OfferContainer");

    // populate all offers
    for (let offerInd in res.data) {
        let template = document.querySelector("#OfferTemplate").content.cloneNode(true);
        let offer = res.data[offerInd];

        // get other trade's information
        let offerer = JSON.parse(await getOtherUserInfo(offer.offererID));

        // get two itmes information
        let offererData = JSON.parse(await getRequest(`/api/getListingData?id=${encodeURIComponent(offer.offererListingID)}`));
        let offereeData = JSON.parse(await getRequest(`/api/getListingData?id=${encodeURIComponent(offer.offereeListingID)}`));

        // store images in variables
        let offererImg;
        let offereeImg;
        if (!offererData.images) {
            offererImg = '/etc/camera.svg';
        } else {
            offererImg = `/img/post/${offererData.images}`;
        }
        if (!offereeData.images) {
            offereeImg = '/etc/camera.svg';
        } else {
            offereeImg = `/img/post/${offereeData.images}`;
        }
        template.querySelector(".OffererPicture").setAttribute('src', offerer.image ? offerer.image : '/etc/person-circle');
        template.querySelector(".offerDate").innerHTML = offer.timestamp.split('T')[0];
        template.querySelector(".OffererName").innerHTML = offerer.username;
        template.querySelector(".TradeOfferer").href = `/traderinfo?trader_id=${offer.offererID}`;
        template.querySelector(".OfferName").innerHTML = "Their item: " + offererData.title;
        template.querySelector(".OfferImg").setAttribute('src', offererImg);
        template.querySelector(".OfferItem").href = `/item?post_id=${offererData.ID}`;
        template.querySelector(".ForName").innerHTML = "My Item: " + offereeData.title;
        template.querySelector(".ForImg").setAttribute('src', offereeImg);
        template.querySelector(".ForItem").href = `/item?post_id=${offereeData.ID}`;
        template.querySelector('.aButton').setAttribute('onclick', `tradeReply(${offer.ID}, ${offer.offererID}, true)`);
        template.querySelector('.dButton').setAttribute('onclick', `tradeReply(${offer.ID}, ${offer.offererID}, false)`);
        parent.appendChild(template);
    }
}

async function tradeReply(offerID, traderID, accept) {
    let confirmation = confirm(`Do you want to ${accept ? 'accept' : 'decline'} trade?`);

    if (confirmation) {
        let res = JSON.parse(await postRequest('/api/replyTradeOffer', {
            'offerID': offerID,
            'accepted': (accept ? 1 : 0)
        }));
        if (res.msg == "Accepted trade offer.") {
            alert(res.msg);
            window.location.href = `/confirmation?offerID=${offerID}&traderID=${traderID}`;
        } else {
            alert(res.msg);
            location.reload();
        }
    }
}

populateOffers();
