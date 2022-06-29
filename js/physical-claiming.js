async function setShopperStats() {
  let itemList = document.getElementsByClassName("shopper-grabber")[0];

  let pContract = getContractInstance(phybullAddr, phyABI);
  let sizeOfList = await pContract.methods.maxClaims().call();
  for (let i = 1; i < sizeOfList; i++) {
    el = document.createElement("option");
    el.value = i + 1;
    el.innerText = i + 1 + " Collectibles";
    itemList.appendChild(el);
  }
  let burnScalar = await pContract.methods.burnScalar().call();
  let erc20Cost = await pContract.methods.erc20Cost().call();
  let erc20Address = await pContract.methods.erc20().call();
  let eContract = getContractInstance(erc20Address, erc20ABI);
  let bal20 = await eContract.methods.balanceOf(addr).call();
  let allowance = await eContract.methods.allowance(addr, phybullAddr).call();

  let bContract = getContractInstance(burger, burgerABI);
  let burgerBalance = await bContract.methods.balanceOf(addr).call();

  let dec = await eContract.methods.decimals().call();

  let price = (erc20Cost / 10 ** dec).toFixed(2);

  let balbal = (bal20 / 10 ** dec).toFixed(2);

  document.getElementById("shopper-info").innerHTML =
    "<strong>Price $" +
    price +
    " USDC and " +
    burnScalar +
    " Burger<br /><br />To Redeem with Burger:<br /></strong >- Hold at least 1 AstroBull + " +
    burnScalar +
    " Burger + $" +
    price +
    " in your wallet<br />- Redeeming will burn the Burger<br />- AstroBull holders may redeem up to " +
    sizeOfList +
    " physical collectibles per wallet<br /><br />‍<strong>Status:</strong><br />There are <strong>" +
    burgerBalance +
    " x Burgers </strong>and<strong> " +
    balbal +
    " USDC</strong <strong> AstroBull Collectibles</strong><br />";

  document.getElementById("moneymoney").innerText = "+ " + price + " USDC";
  document.getElementById("burgerburger").innerText =
    "+ " + burnScalar + " Burger";

  /// add event listener to redeem button
  document.getElementById("phy-button").addEventListener("click", claimPhys);
  // do checks for txn
  // add set approval function stuffs
}

async function claimPhys() {
  let key = 0;
  let errorMsg = "Error:\n";
  let pContract = getContractInstance(phybullAddr, phyABI);
  let sizeOfList = await pContract.methods.maxClaims().call();
  let burnScalar = await pContract.methods.burnScalar().call();
  let erc20Cost = await pContract.methods.erc20Cost().call();
  let erc20Address = await pContract.methods.erc20().call();
  let eContract = getContractInstance(erc20Address, erc20ABI);
  let bal20 = await eContract.methods.balanceOf(addr).call();
  let bContract = getContractInstance(burger, burgerABI);
  let burgerBalance = await bContract.methods.balanceOf(addr).call();
  let dec = await eContract.methods.decimals().call();
  let price = (erc20Cost / 10 ** dec).toFixed(2);
  let balbal = (bal20 / 10 ** dec).toFixed(2);
  var e = document.getElementsByClassName("shopper-grabber")[0];
  var f = parseInt(e.options[e.selectedIndex].value);
  let cost = (f * price).toFixed(2);
  let costBurg = f * burnScalar;
  let isClaiming = await pContract.methods.isClaiming().call();
  if (!isClaiming) {
    key += 1;
    errorMsg += "claiming is not active\n";
  }
  let isBurner = await bContract.methods.burners(phybullAddr).call();
  if (!isBurner) {
    key += 1;
    errorMsg += "physical bull contract not set as burner\n";
  }
  if (cost > balbal) {
    key += 1;
    errorMsg += "insufficient erc20 balance\n";
  }
  let status = await setERC20Approval(f);
  if (!status) {
    key += 1;
    errorMsg += "insufficient erc20 allowance for physical bull contract\n";
  }
  if (costBurg > burgerBalance) {
    key += 1;
    errorMsg += "insufficient burger balance\n";
  }

  let claims = await pContract.methods.accountClaims(addr).call();
  let maxClaims = await pContract.methods.maxClaims().call();
  if (claims + f > maxClaims) {
    key += 1;
    console.log(claims, f, maxClaims);
    errorMsg += "claiming too many physical bulls\n";
  }

  if (key == 0) {
    if (confirm("Claim " + f + " physical bulls?") == true) {
      await pContract.methods.claimBulls(f).send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
    alert(errorMsg);
  }
}

/**
 * Sets phybull contract as approved operator if not already
 */
async function setERC20Approval(f) {
  let pContract = getContractInstance(phybullAddr, phyABI);
  let erc20Address = await pContract.methods.erc20().call();
  let eContract = getContractInstance(erc20Address, erc20ABI);
  let allowance = await eContract.methods.allowance(addr, phybullAddr).call();
  let erc20Cost = await pContract.methods.erc20Cost().call();
  let dec = await eContract.methods.decimals().call();
  let price = (erc20Cost / 10 ** dec).toFixed(2);

  // check if approved first //
  if (allowance < erc20Cost * f) {
    let sss = confirm(
      "This contract cannot move this many of your erc20 tokens. You must set an appropriate allowance.\nConfirm you want to give this contract an allowance of " +
        "$" +
        f * price +
        " USDC tokens"
    );
    if (sss) {
      try {
        await eContract.methods
          .approve(phybullAddr, f * erc20Cost)
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
  //   var parent = getContractInstance(astroAddr, superABI);
  //   console.log(parent);
  //   var operator = grill2;
  //   let status = await parent.methods.isApprovedForAll(addr, operator).call();
  //   if (!status) {
  //     let status2 = confirm(
  //       "The grill is not an approved operator of your tokens.\nConfirm you want to set the grill as an approved operator."
  //     );
  //     if (status2) {
  //       try {
  //         await parent.methods
  //           .setApprovalForAll(operator, true)
  //           .send({ from: addr });
  //         return true;
  //       } catch {
  //         console.log("Txn rejected");
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return true;
  //   }
}

async function shoppingSetter() {
  console.log("hi");
  let pContract = getContractInstance(phybullAddr, phyABI);
  let burnScalar = await pContract.methods.burnScalar().call();
  let erc20Cost = await pContract.methods.erc20Cost().call();
  let erc20Address = await pContract.methods.erc20().call();
  let eContract = getContractInstance(erc20Address, erc20ABI);
  let dec = await eContract.methods.decimals().call();
  let price = (erc20Cost / 10 ** dec).toFixed(2);
  var e = document.getElementsByClassName("shopper-grabber")[0];
  var f = parseInt(e.options[e.selectedIndex].value);

  let cost = (f * price).toFixed(2);
  let costBurg = f * burnScalar;

  document.getElementById("moneymoney").innerText = "+ " + cost + " USDC";
  document.getElementById("burgerburger").innerText =
    "+ " + costBurg + " Burger";
}
