// gets floor price (past 7 (or 30) days) for a collection by address
async function getFloorPrice(_addr) {
  var options = {
    address: _addr,
    chain: "eth",
  };
  var floor = 0;
  try {
    floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
  } catch (error) {
    console.log("No sales the past 7 days");
    try {
      options.days = 30;
      floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
    } catch (error) {
      console.log("No sales the past 30 days");
      try {
        options.days = 90;
        floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
      } catch (error) {
        console.log("No sales the past 90 days");
        floor.price = 0;
      }
    }
  }
  // const floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
  price = parseFloat(web3.utils.fromWei(floor.price, "ether"));
  return price;
}

/**
 * Counts and sets number of unique stakers in contract
 * @param {*} _old Stakes in grill 1 by id
 * @param {*} _new Stakes in grill 2 by id
 */
async function setUniqueStakes(_old, _new) {
  var gContract = getContractInstance(grill2, grillABI);
  var addrs = [];
  // push addr of old stake
  document.getElementById("astro-owner-count").innerText = "0";
  for (let i = 0; i < _old.length; i++) {
    let stake = await gContract.methods.stakeStorageOld(_old[i]).call();
    if (addrs.indexOf(stake.staker) == -1) {
      var oldNum = document.getElementById("astro-owner-count").innerText;
      if (oldNum == "...") {
        oldNum = parseInt(0);
      } else {
        parseInt(oldNum);
      }
      document.getElementById("astro-owner-count").innerText =
        parseInt(oldNum) + parseInt(1);
      addrs.push(stake.staker);
    }
  }
  for (let i = 0; i < _new.length; i++) {
    let stake = await gContract.methods.stakeStorage(_new[i]).call();
    if (addrs.indexOf(stake.staker) == -1) {
      var oldNum = document.getElementById("astro-owner-count").innerText;
      if (oldNum == "...") {
        oldNum = parseInt(0);
      } else {
        parseInt(oldNum);
      }
      document.getElementById("astro-owner-count").innerText =
        parseInt(oldNum) + parseInt(1);
      addrs.push(stake.staker);
    }
  }
  console.log("done counting stakers");
}

// sets the statistics page
async function setStakesStats() {
  let stakedIds1 = await getNFTIds(grill1, astroAddr, mainChain);
  let stakedIds2 = await getNFTIds(grill2, astroAddr, mainChain);
  // set number of total stakes
  document.getElementById("astro-stake-total").innerText =
    parseInt(stakedIds1.length) + parseInt(stakedIds2.length);
  // set todays date
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
  var year = now.getFullYear();
  var month = months_arr[now.getMonth()];
  var day = now.getDate();
  var today = month + " " + day + ", " + year;
  document.getElementById("astro-volume-date").innerText = today;
  // set astro floor price for staked bulls
  let aFloor = await getFloorPrice(astroAddr);
  let pp = (aFloor * (stakedIds1.length + stakedIds2.length)).toFixed(4);
  document.getElementById("astro-volume").innerText = " Ξ " + pp;
  // await getStakerCounts("ASTRO");
  await setUniqueStakes(stakedIds1, stakedIds2);
  // document.getElementById("astro-owner-count").innerText = aOwners;
}

/**
 * Gets account's nfts tokenIds for collection
 */
async function getNFTIds(account, collection, chain) {
  let cursor = null;
  let ids = [];
  do {
    const response = await Moralis.Web3API.account.getNFTs({
      chain: chain,
      address: account,
      token_address: collection,
      cursor: cursor,
    });
    for (const nft of response.result) {
      ids.push(nft.token_id);
      // increment locked
      var oldNum = document.getElementById("astro-stake-total").innerText;
      if (oldNum == "...") {
        oldNum = parseInt(0);
      } else {
        parseInt(oldNum);
      }
      document.getElementById("astro-stake-total").innerText =
        parseInt(oldNum) + parseInt(1);
      // increment stakers
    }
    cursor = response.cursor;
  } while (cursor != "" && cursor != null);
  return ids;
}
