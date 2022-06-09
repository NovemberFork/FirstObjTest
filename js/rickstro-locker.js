// set a user's rickstro stakes
async function setMyRickstroStakes() {
  var g = document.getElementById("rickstro-table-data");
  if (g.hasChildNodes) {
    while (g.childNodes.length > 2) {
      g.removeChild(g.lastChild);
    }
  }
  let user = Moralis.User.current();
  if (user) {
    let gContract = getGrillContractR();
    let myStakes = await gContract.methods
      .getIdsOfAddr(web3.utils.toChecksumAddress(user.get("ethAddress")))
      .call();
    for (let i = 0; i < myStakes.length; i++) {
      let tokenId = myStakes[i];
      let t = web3.utils.toBN(tokenId);
      bullId = t.words[0];
      let d1 = document.createElement("div");
      let df1 = document.createElement("div");
      df1.classList.add("w-form");
      let f1 = document.createElement("form");
      f1.id = "email-form";
      f1.name = "email-form";
      f1.method = "get";
      let l1 = document.createElement("label");
      l1.classList.add("w-checkbox");
      l1.classList.add("checkbox-field-2");
      let i1 = document.createElement("input");
      i1.classList.add("w-checkbox-input");
      i1.classList.add("rickstro-unstake-checkboxes");
      i1.type = "checkbox";
      i1.name = "checkbox";
      i1.id = "checkbox";
      l1.appendChild(i1);
      f1.appendChild(l1);
      df1.appendChild(f1);
      d1.appendChild(df1);
      let d2 = document.createElement("div");
      let i2 = document.createElement("img");
      i2.loading = "lazy";
      i2.width = "72";
      i2.style.borderRadius = "50%";
      let d21 = document.createElement("div");
      d21.classList.add("text-block-17");
      d21.innerText = "Rickstro Bull " + bullId;
      d2.appendChild(i2);
      d2.appendChild(d21);
      let stake = await gContract.methods.getStake(tokenId).call();
      let timestamp = stake.timestamp;
      let date = new Date(timestamp * 1000);
      let now = new Date();
      var months_arr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var year = date.getFullYear();
      var month = months_arr[date.getMonth()];
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      if (date.getMinutes() < 10) {
        minutes = "0" + minutes;
      }
      var dayDate = day + "-" + month + "-" + year;
      var timeDate = hours + ":" + minutes;
      d3 = document.createElement("div");
      let d31 = document.createElement("div");
      d31.classList.add("text-block-17");
      d31.innerText = dayDate;
      let d32 = document.createElement("div");
      d32.classList.add("text-block-17");
      d32.innerText = timeDate;
      d3.appendChild(d31);
      d3.appendChild(d32);
      d4 = document.createElement("div");
      let diff = (now.getTime() - date.getTime()) / 1000;
      let daysIn = parseInt(diff / (24 * 60 * 60));
      let d41 = document.createElement("div");
      d41.classList.add("text-block-17");
      d41.innerText = daysIn;
      d4.appendChild(d41);
      let daysTilNextBurger = await daysTillNextBurger(tokenId, "RICKSTRO");
      d5 = document.createElement("div");
      let d51 = document.createElement("div");
      d51.classList.add("text-block-17");
      d51.innerText = parseInt(daysTilNextBurger);
      d5.appendChild(d51);
      d6 = document.createElement("div");
      let burgerNum = parseInt(await countBurgersPerBull(tokenId, "RICKSTRO"));
      let d61 = document.createElement("div");
      d61.classList.add("text-block-17");
      d61.innerText = burgerNum;
      d6.appendChild(d61);
      el = document.createElement("div");
      el.classList.add("w-layout-grid");
      if (i % 2 == 0) {
        el.classList.add("grid-row1");
        d1.classList.add("tb-row1");
        d2.classList.add("tb-row1");
        d3.classList.add("tb-row1");
        d4.classList.add("tb-row1");
        d5.classList.add("tb-row1");
        d6.classList.add("tb-row1");
      } else {
        el.classList.add("grid-row2");
        d1.classList.add("tb-row2");
        d2.classList.add("tb-row2");
        d3.classList.add("tb-row2");
        d4.classList.add("tb-row2");
        d5.classList.add("tb-row2");
        d6.classList.add("tb-row2");
      }
      el.appendChild(d1);
      el.appendChild(d2);
      el.appendChild(d3);
      el.appendChild(d4);
      el.appendChild(d5);
      el.appendChild(d6);
      g.appendChild(el);
      let imgSrc = await getTokenImage("RICKSTRO", bullId);
      i2.src = imgSrc;
    }
    if (myStakes.length > 0) {
      document
        .getElementById("unstake-rickstro-btn")
        .addEventListener("click", unstakeMyRickstroBulls);
    }
  }
}

// unstake a rickstro bulls from rickstro grill contract
async function unstakeMyRickstroBulls() {
  let checkboxes = document.getElementsByClassName(
    "rickstro-unstake-checkboxes"
  );
  let key = 0;
  let astroIds = [];
  let amounts = [];
  let errorMsg = "Error: ";
  let gContract = getGrillContractR();

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      let num =
        checkboxes[
          i
        ].parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].innerText.split(
          " "
        )[2];
      let bullId = parseInt(num);
      let tokenId = web3.utils
        .toBN("340282366920938463463374607431768211456")
        .add(web3.utils.toBN(bullId));
      astroIds.push(tokenId.toString());
      amounts.push(1);
    }
  }
  if (astroIds.length == 0) {
    errorMsg += "must select bulls to unstake, ";
    key += 1;
  }
  if (astroIds.length > 20) {
    errorMsg += "cannot unstake more than 20 bull per txn, ";
    key += 1;
  }

  if (key == 0) {
    if (confirm("Unstake these bulls?") == true) {
      await gContract.methods
        .removeStakes(astroIds, amounts)
        .send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
  }
}
