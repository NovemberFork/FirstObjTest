async function getAllMyBulls() {
  let gContract = getContractInstance(grill2, grillABI);
  let ownedBulls = await getNFTs(addr, astroAddr, "0x1");
  let oldStakes = await gContract.methods.stakedIdsPerAccountOld(addr).call();
  let newStakes = await gContract.methods.stakedIdsPerAccount(addr).call();
  let allIds = [];
  for (let i = 0; i < ownedBulls.length; i++) {
    allIds.push(ownedBulls[i].token_id);
  }
  for (let i = 0; i < oldStakes.length; i++) {
    allIds.push(oldStakes[i]);
  }
  for (let i = 0; i < newStakes.length; i++) {
    allIds.push(newStakes[i]);
  }
  //

  return allIds;
}

async function setMyBullsForClaiming() {
  let mContract = getContractInstance(metabullAddr, metaABI);
  let bContract = getContractInstance(burger, burgerABI);
  let gallary = document.getElementById("pot-meta-gal");
  let gallary2 = document.getElementById("used-meta-gal");
  let allIds = await getAllMyBulls();
  /// set top stats first
  let burnScalar = await mContract.methods.burnScalar().call();
  let youHave = "...",
    cantUse = "...",
    burgerBalance = "...",
    claimedMeta = "...",
    potentialClaims = "...",
    tot = allIds.length;
  let command = `<strong>To Redeem:</strong><br />- ${burnScalar} Burgers are required for 1 Metaverse AstroBull (MetaBull)<br />- You need to have at least 1 AstroBull(s) in your wallet or in the Grill <br />- Choose 1 AstroBull to create a MetaBull <br />- MetaBull will inherit the traits of the Original AstroBull<br />‍<br /><strong >You have : </strong ><br />${tot} x AstroBulls  <br />${burgerBalance} x Burgers <br />${claimedMeta} x MetaBull (${potentialClaims} of ${youHave} can be claimed)<br />`;
  document.getElementById("redeem-txt").innerHTML = command;
  let key = false;
  (youHave = 0), (cantUse = 0);
  let addLater1 = [];
  let addLater2 = [];
  for (let i = 0; i < allIds.length; i++) {
    if (!(await mContract.methods.portedIds(allIds[i]).call())) {
      addLater1.push(allIds[i]);
      key = true;
      youHave += 1;
    } else {
      addLater2.push(allIds[i]);
      cantUse += 1;
    }
  }
  burgerBalance = await bContract.methods.balanceOf(addr).call();
  claimedMeta = await mContract.methods.balanceOf(addr).call();
  potentialClaims = parseInt(youHave * parseInt(parseInt(burgerBalance) / 2));
  command = `<strong>To Redeem:</strong><br />- ${burnScalar} Burgers are required for 1 Metaverse AstroBull (MetaBull)<br />- You need to have at least 1 AstroBull(s) in your wallet or in the Grill <br />- Choose 1 AstroBull to create a MetaBull <br />- MetaBull will inherit the traits of the Original AstroBull<br />‍<br /><strong >You have : </strong ><br />${tot} x AstroBulls  <br />${burgerBalance} x Burgers <br />${claimedMeta} x MetaBull (${potentialClaims} of ${youHave} can be claimed)<br />`;
  for (thing in addLater1) {
    gallary.appendChild(await makeThing(addLater1[thing]));
  }
  for (thing in addLater2) {
    gallary2.appendChild(await makeThing(addLater2[thing]));
  }
  document.getElementById("redeem-txt").innerHTML = command;
  if (key) {
    document
      .getElementById("claim-meta-btn")
      .addEventListener("click", passBulls);
  }
}

async function makeThing(tokenId) {
  let bn = web3.utils.toBN(tokenId);
  let bullId = bn.words[0];
  /// new
  /// make base thing
  let ele = document.createElement("div"); // main thing
  let ele0 = document.createElement("img"); // pic
  let ele1 = document.createElement("div"); //A burger club #
  let ele2 = document.createElement("div"); // #1234
  let ele3 = document.createElement("div"); // form wrapper
  let ele31 = document.createElement("form"); // form
  let ele311 = document.createElement("label"); // check box wrapper
  let ele3111 = document.createElement("input"); // check box
  ele311.appendChild(ele3111);
  ele31.appendChild(ele311);
  ele3.appendChild(ele31);
  ele.appendChild(ele0);
  ele.appendChild(ele1);
  ele.appendChild(ele2);
  ele.appendChild(ele3);
  /// set classes
  ele.classList.add("div-block-15");
  ele0.src = await getTokenImage("ASTRO", bullId);
  ele0.loading = "lazy";
  ele1.classList.add("box-title");
  ele2.classList.add("text-block-9");
  ele3.classList.add("form-block-3");
  ele3.classList.add("w-form");
  ele31.id = "email-form";
  ele31.name = "email-form";
  ele31.method = "get";
  ele311.classList.add("w-checkbox");
  ele3111.type = "checkbox";
  ele3111.id = "checkbox";
  ele3111.name = "checkbox";
  ele3111.for = "checkbox";
  ele3111.classList.add("w-check-box-input");
  ele3111.classList.add("checkbox-4");
  ele3111.classList.add("meta-claimer");
  /// set texts
  ele1.innerText = "AstroBull #" + bullId;
  ele2.innerText = "#" + bullId;
  return ele;
}

async function passBulls() {
  let checkboxes = document.getElementsByClassName("meta-claimer");
  let astroIds = [];

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      let num =
        checkboxes[i].parentNode.parentNode.parentNode.parentNode.childNodes[2]
          .innerText;

      let bullId = parseInt(num.substring(1, num.length));
      let tokenId = web3.utils
        .toBN("340282366920938463463374607431768211456")
        .add(web3.utils.toBN(bullId));
      astroIds.push(tokenId.toString());
    }
  }

  if (astroIds.length > 0) {
    localStorage.setItem("ToClaim", JSON.stringify(astroIds));
    // localStorage.setItem("ToClaim", astroIds);
    window.location = "shop-04.html";
  }
}
