// function to return the number of days a bull must continue being staked for until the next burger is earned
async function daysTillNextBurger(_id, _collection) {
  let parent = getContractInstance(astroAddr, superABI);
  let gContract = getContractInstance(grill2, grillABI);
  let now = new Date();
  now = now.getTime() / 1000;
  var start;
  var stake;

  let em = await gContract.methods
    .emissionStorage(await gContract.methods.emissionChanges().call())
    .call();

  // use this for main net
  // if (await parent.methods.balanceOf(_id, grill1).call()) {
  //   stake = await gContract.methods.stakeStorageOld(_id).call();
  // } else if (await parent.methods.balanceOf(_id, grill2).call()) {
  //   stake = await gContract.methods.stakeStorage(_id).call();
  // }

  // this for testing
  stake = await gContract.methods.stakeStorage(_id).call();
  if (stake.timestamp == 0) {
    stake = await gContract.methods.stakeStorageOld(_id).call();
  }

  let tokenStart = stake.timestamp;
  let emStart = em.timestamp;
  if (tokenStart > emStart) {
    start = tokenStart;
  } else {
    start = emStart;
  }
  let diff = now - start;
  let diffDays = diff / (3600 * 24);
  let emRate = em.rate;
  let emDays = emRate / (3600 * 24);
  let completed = parseInt(diff / emRate);
  let left = emDays - ((diffDays - completed * emDays) % emDays);
  return parseInt(left);
}

// set a user's astro stakes
async function setMyAstroStakes() {
  // wipe presets ///
  var g = document.getElementById("astro-table-data");
  if (g.hasChildNodes) {
    while (g.childNodes.length > 2) {
      g.removeChild(g.lastChild);
    }
  }
  let user = Moralis.User.current();
  if (user) {
    let gContract = getContractInstance(grill2, grillABI);
    let myStakesOld = await gContract.methods
      .stakedIdsPerAccountOld(
        web3.utils.toChecksumAddress(user.get("ethAddress"))
      )
      .call();
    /**
     * Might need to refine already removed stakes if contract doesnt
     */
    let myStakesNew = await gContract.methods
      .stakedIdsPerAccount(web3.utils.toChecksumAddress(user.get("ethAddress")))
      .call();

    for (let i = 0; i < myStakesOld.length; i++) {
      let tokenId = myStakesOld[i];
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
      i1.classList.add("astro-unstake-checkboxes");
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
      d2.appendChild(i2);
      d2.appendChild(d21);
      /// set stats ///
      d21.innerText = "Astro Bull " + bullId;
      let stake = await gContract.methods.stakeStorageOld(tokenId).call();
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
      let daysTilNextBurger = await daysTillNextBurger(tokenId, "ASTRO");
      d5 = document.createElement("div");
      let d51 = document.createElement("div");
      d51.classList.add("text-block-17");
      d51.innerText = daysTilNextBurger;
      d5.appendChild(d51);
      d6 = document.createElement("div");
      let burgerNum = parseInt(
        await gContract.methods.countEmissions(timestamp).call()
      );
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
      let imgSrc = await getTokenImage("ASTRO", bullId);
      i2.src = imgSrc;
    }
    var sss = 1;
    if (myStakesOld.length % 2 == 0) {
      sss = 0;
    }
    for (let i = 0; i < myStakesNew.length; i++) {
      let tokenId = myStakesNew[i];
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
      i1.classList.add("astro-unstake-checkboxes");
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
      d21.innerText = "Astro Bull " + bullId;
      d2.appendChild(i2);
      d2.appendChild(d21);
      let stake = await gContract.methods.stakeStorage(tokenId).call();
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
      let daysTilNextBurger = await daysTillNextBurger(tokenId, "ASTRO");
      d5 = document.createElement("div");
      let d51 = document.createElement("div");
      d51.classList.add("text-block-17");
      d51.innerText = daysTilNextBurger;
      d5.appendChild(d51);
      d6 = document.createElement("div");
      let burgerNum = parseInt(
        await gContract.methods.countEmissions(timestamp).call()
      );
      let d61 = document.createElement("div");
      d61.classList.add("text-block-17");
      d61.innerText = burgerNum;
      d6.appendChild(d61);
      el = document.createElement("div");
      el.classList.add("w-layout-grid");
      if ((i + sss) % 2 == 0) {
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
      let imgSrc = await getTokenImage("ASTRO", bullId);
      i2.src = imgSrc;
    }
    if (myStakesNew.length > 0 || myStakesOld.length > 0) {
      document
        .getElementById("unstake-astro-btn")
        .addEventListener("click", unstakeMyAstroBulls);
    }
  }
}

// unstake astro bulls from astro grill contract
async function unstakeMyAstroBulls() {
  let checkboxes = document.getElementsByClassName("astro-unstake-checkboxes");
  var parent = getContractInstance(astroAddr, superABI);
  var gContract = getContractInstance(grill2, grillABI);
  let key = 0;
  let astroIdsOld = [];
  let astroIdsNew = [];
  let amountsOld = [];
  let amountsNew = [];
  let errorMsg = "Error: ";
  // let gContract = getGrillContractA();

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
      /// see who owned what
      /// for launch
      if (await parent.methods.balanceOf(_id, grill1).call()) {
        astroIdsOld.push(tokenId.toString());
        amountsOld.push(1);
      } else if (await parent.methods.balanceOf(_id, grill2).call()) {
        astroIdsNew.push(tokenId.toString());
        amountsNew.push(1);
      }
      // /// for testing
      // // assumes new
      // stake = await gContract.methods.stakeStorage(tokenId).call();
      // if (stake.timestamp == 0) {
      //   // if old
      //   astroIdsOld.push(tokenId.toString());
      //   amountsOld.push(1);
      // } else {
      //   // if new
      //   astroIdsNew.push(tokenId.toString());
      //   amountsNew.push(1);
      // }
    }
  }
  if (astroIdsOld.length + astroIdsNew.length == 0) {
    errorMsg += "must select bulls to unstake, ";
    key += 1;
  }

  if (key == 0) {
    if (confirm("Unstake these bulls?") == true) {
      await gContract.methods
        .removeStakes(astroIdsOld, amountsOld, astroIdsNew, amountsNew)
        .send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
  }
}
