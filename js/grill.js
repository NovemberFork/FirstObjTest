/**
 * Sets user's bull data
 */
async function setMyBulls() {
  var g = document.getElementById("my-astro-bulls");
  // wipe all elements ///
  removeAllChildNodes(g);
  // make astro gallery
  if (addr != "") {
    let bulls = await getNFTs(addr, astroAddr, "0x1");
    for (let j = 0; j < bulls.length; j++) {
      let bull = bulls[j].token_id;
      let bn = web3.utils.toBN(bull);
      let bullId = bn.words[0];
      let el = document.createElement("div");
      el.classList.add("g-box");
      let i = document.createElement("img");
      let imgSrc = await getTokenImage("ASTRO", bullId);
      i.src = imgSrc;
      i.loading = "lazy";
      let d1 = document.createElement("div");
      d1.classList.add("box-title");
      d1.innerText = "Astro Bull " + bullId;
      let d2 = document.createElement("div");
      d2.classList.add("text-block-9");
      d2.innerText = "#" + bullId;
      let d4 = document.createElement("div");
      d4.classList.add("form-block");
      d4.classList.add("w-form;");
      let form = document.createElement("form");
      form.id = "email-form";
      form.name = "email-form";
      form.method = "get";
      let label = document.createElement("label");
      label.classList.add("w-checkbox");
      label.classList.add("checkbox-field");
      let input = document.createElement("input");
      input.type = "checkbox";
      input.id = "checkbox";
      input.name = "checkbox";
      input.onclick = astroStakeText;
      input.classList.add("w-checkbox-input");
      input.classList.add("astro-stake-checkboxes");
      let span = document.createElement("span");
      span.classList.add("w-form-label");
      span.for = "checkbox";
      el.appendChild(i);
      el.appendChild(d1);
      el.appendChild(d2);
      input.appendChild(span);
      label.appendChild(input);
      form.appendChild(label);
      d4.appendChild(form);
      el.appendChild(d4);
      g.appendChild(el);
    }
    // enable stake buttons
    document
      .getElementById("stake-astro-btn")
      .addEventListener("click", stakeMyAstroBulls);
  }
  // make rickstro gallary
  // if (addr != "") {
  //   let bulls = await getRickstroBulls();
  //   for (let j = 0; j < bulls.length; j++) {
  //     let bull = bulls[j].token_id;
  //     let bn = web3.utils.toBN(bull);
  //     let bullId = bn.words[0];
  //     let tokenId = bn.toString();
  //     let el = document.createElement("div");
  //     el.classList.add("g-box");
  //     let i = document.createElement("img");
  //     let imgSrc = await getTokenImage("RICKSTRO", bullId);
  //     i.src = imgSrc;
  //     i.loading = "lazy";
  //     let d1 = document.createElement("div");
  //     d1.classList.add("box-title");
  //     d1.innerText = "Rickstro Bull " + bullId;
  //     let d2 = document.createElement("div");
  //     d2.classList.add("text-block-9");
  //     d2.innerText = "#" + bullId;
  //     let d4 = document.createElement("div");
  //     d4.classList.add("form-block");
  //     d4.classList.add("w-form;");
  //     let form = document.createElement("form");
  //     form.id = "email-form";
  //     form.name = "email-form";
  //     form.method = "get";
  //     let label = document.createElement("label");
  //     label.classList.add("w-checkbox");
  //     label.classList.add("checkbox-field");
  //     let input = document.createElement("input");
  //     input.type = "checkbox";
  //     input.id = "checkbox";
  //     input.name = "checkbox";
  //     input.onclick = rickstroStakeText;
  //     input.classList.add("w-checkbox-input");
  //     input.classList.add("rickstro-stake-checkboxes");
  //     let span = document.createElement("span");
  //     span.classList.add("w-form-label");
  //     span.for = "checkbox";
  //     el.appendChild(i);
  //     el.appendChild(d1);
  //     el.appendChild(d2);
  //     input.appendChild(span);
  //     label.appendChild(input);
  //     form.appendChild(label);
  //     d4.appendChild(form);
  //     el.appendChild(d4);
  //     g1.appendChild(el);
  //   }
  //   // enable stake buttons
  //   document
  //     .getElementById("stake-rickstro-btn")
  //     .addEventListener("click", stakeMyRickstroBulls);
  // }
}

/**
 * Sets you selected x astro bull to be locked
 */
function astroStakeText() {
  let checkboxes = document.getElementsByClassName("astro-stake-checkboxes");
  let aCount = document.getElementById("astro-count");
  let astroCount = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      astroCount += 1;
    }
  }
  aCount.innerText = astroCount;
}

/**
 * Transaction to stake bulls
 */
async function stakeMyAstroBulls() {
  let checkboxes = document.getElementsByClassName("astro-stake-checkboxes");
  let key = 0;
  let astroIds = [];
  let amounts = [];
  let errorMsg = "Error: ";
  let gContract = getContractInstance(grill2, grillABI);
  let grillOpen = await gContract.methods.isStaking().call();

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
      amounts.push(1);
    }
  }

  if (!grillOpen) {
    errorMsg += "the grill is not currently open, ";
    key += 1;
  }
  if (astroIds.length == 0) {
    errorMsg += "must select bulls to stake, ";
    key += 1;
  }
  let status = await setGrillApproval();
  if (!status) {
    errorMsg += "the grill is not an approved operator of your tokens, ";
    key += 1;
  }

  if (await gContract.methods.blacklist(addr).call()) {
    errorMsg += "this address is blacklisted, ";
    key += 1;
  }

  if (key == 0) {
    if (confirm("Stake these bulls?") == true) {
      alert(
        "After you lock up your AstroBulls, it will take a few minutes for Ethereum blockchain to be updated. Please be patient then go over to see your locked up Bulls in the Astro Bull Locker"
      );
      await gContract.methods.addStakes(astroIds, amounts).send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
  }
}

/**
 * Sets grill as approved operator if not already
 */
async function setGrillApproval() {
  // check if approved first //
  var parent = getContractInstance(astroAddr, superABI);
  console.log(parent);
  var operator = grill2;
  let status = await parent.methods.isApprovedForAll(addr, operator).call();
  if (!status) {
    let status2 = confirm(
      "The grill is not an approved operator of your tokens.\nConfirm you want to set the grill as an approved operator."
    );
    if (status2) {
      try {
        await parent.methods
          .setApprovalForAll(operator, true)
          .send({ from: addr });
        return true;
      } catch {
        console.log("Txn rejected");
        return false;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
}

/**
 * Function to convert decimal tokenId -> hex 1155 json format (64 padded)
 * @notice tokenId must be a string
 */
// function tokenToJson(tokenId) {
//   let dec = web3.utils.toBN(tokenId);
//   let hex = web3.utils.toHex(dec);
//   let pad = 64 - hex.length + 2;
//   let padded = "";
//   for (let i = 0; i < pad; i++) {
//     padded += "0";
//   }
//   padded += hex.substring(2);
//   return padded + ".json";
// }
