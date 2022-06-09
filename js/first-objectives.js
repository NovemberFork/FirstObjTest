/**
 * This will be all of the js needed for interacting with first-objective contracts
 */

const firstParams = {
  erc20Abi: "",
  burgerAddr: "",
  burgerAbi: "",
  metabullAddr: "",
  metabullAbi: "",
  phybullAddr: "",
  phybullAbi: "",
};

/**
 * Function for getting contract instances to calls/txns
 */
async function getContractInstance(addr, abi) {
  return new web3.eth.Contract(abi, address);
}

/**
 * Function to call when clicking the claimBurgers button
 */
async function claimBurgers() {
  let key = 0;
  let errorMsg = "Error: ";
  /// update this from front end value
  let quant = 0;
  let burgerContract = getContractInstance(
    firstParams.burgerAddr,
    firstParams.burgerAbi
  );
  // is claiming ?
  let isClaiming = await burgerContract.methods.isClaiming().call();
  if (!isClaiming) {
    key += 1;
    errorMsg += "claiming is not active, ";
  }
  // claiming > 0 ?
  if (quant == 0) {
    key += 1;
    errorMsg += "cannot claim 0 tokens, ";
  }
  // can claim this much ?
  let remaining = await burgerContract.methods.tokenClaimsLeft(addr).call();
  if (quant > remaining) {
    key += 1;
    errorMsg += "not enough claims left, ";
  }
  // mint
  if (key == 0) {
    /// claim them
    let confirmation = "Claim " + quant + " burgers?";
    if (confirm(confirmation) == true) {
      //   alert("");
      await burgerContract.methods.claimBurgers(quant).send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
  }
}

/**
 * Function to call when clicking the claimMetabull button
 */
async function claimMetabulls() {
  let key = 0;
  let errorMsg = "Error: ";
  /// update this from front end value
  //   let quant = 0;
  let burnQuant = 0;
  let aBullIds = [1, 2, 3];
  let metabullContract = getContractInstance(
    firstParams.metabullAddr,
    firstParams.metabullAbi
  );
  let burgerContract = getContractInstance(
    firstParams.burgerAddr,
    firstParams.burgerAbi
  );
  // can burn this much ?
  let burnAvail = await burgerContract.methods.balanceOf(addr).call();
  if (burnQuant > burnAvail) {
    key += 1;
    errorMsg += "insufficient balance of burgers, ";
  }
  // is minting ?
  let isMinting = await metabullContract.methods.isMinting().call();
  if (!isMinting) {
    key += 1;
    errorMsg += "minting is not active, ";
  }
  // mint > 0 ?
  if (aBullIds.length == 0) {
    key += 1;
    errorMsg += "cannot claim 0 tokens, ";
  }
  // all not claimed yet ?
  let canClaim = true;
  let brokenIds = "";
  for (let i = 0; i < aBullIds.length; i++) {
    let ported = await metabullContract.methods.portedIds(aBullIds[i]).call();
    if (ported) {
      canClaim = false;
      brokenIds += aBullIds + ", ";
    }
  }
  // which tokens already claimed ?
  if (!canClaim) {
    key += 1;
    errorMsg += "token(s) " + brokenIds + "already claimed";
  }
  // mint
  if (key == 0) {
    /// claim them
    let confirmation = "Mint " + quant + " metabulls?";
    if (confirm(confirmation) == true) {
      //   alert("");
      await metabullContract.methods.claimBull(aBullIds).send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
  }
}

/**
 * Function to call when clicking the claimPhybull button
 */
async function claimPhybulls() {
  let key = 0;
  let errorMsg = "Error: ";
  /// update this from front end value
  let aBullId = 123;
  let quant = 0;
  let burgerContract = getContractInstance(
    firstParams.burgerAddr,
    firstParams.burgerAbi
  );
  let phybullContract = getContractInstance(
    firstParams.phybullAddr,
    firstParams.phybullAbi
  );
  let erc20Address = await phybullContract.methods.erc20Address().call();
  let erc20Contract = getContractInstance(erc20Address, firstParams.erc20Abi);
  // enough erc20 ?
  let erc20Bal = erc20Contract.methods.balanceOf(addr).call();
  let erc20Cost = await phybullContract.methods.erc20Cost().call();
  let erc20Price = erc20Cost * quant;
  if (erc20Price > erc20Bal) {
    key += 1;
    errorMsg += "insufficient erc20 balance, ";
  }
  // burner has enough allowance ?
  let currentAllowance = await erc20Contract.methods
    .allowance(addr, firstParams.phybullAddr)
    .call();

  if (currentAllowance < erc20Price) {
    let s = await setERC20Allowance();
    if (!s) {
      key += 1;
      errorMsg += "not enough erc20 tokens";
    }
  }
  // can burn this much ?
  let burgBal = await burgerContract.methods.balanceOf(addr).call();
  let burnScalar = await phybullContract.methods.burnScalar().call();
  let burnCost = quant * burnScalar;
  if (burnCost > burgBal) {
    key += 1;
    errorMsg += "insufficient burger balance, ";
  }
  // is claiming ?
  let isClaiming = await phybullContract.methods.isClaiming().call();
  if (!isClaiming) {
    key += 1;
    errorMsg += "claiming is not active, ";
  }
  // claiming > 0 ?
  if (quant == 0) {
    key += 1;
    errorMsg += "cannot claim 0 tokens, ";
  }
  // can claim this much ?
  let used = await phybullContract.methods.accountClaims(addr).call();
  let max = await phybullContract.methods.maxClaims().call();
  if (quant + used > max) {
    key += 1;
    errorMsg += "exceeds max claims, ";
  }
  // mint
  if (key == 0) {
    /// claim them
    let confirmation = "Claim " + quant + " physical bulls ?";
    if (confirm(confirmation) == true) {
      //   alert("");
      await phybullContract.methods
        .claimBulls(quant, aBullId)
        .send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
  }
}

/**
 * Function to set an erc20 allowance
 */
async function setERC20Allowance() {
  let phybullContract = getContractInstance(
    firstParams.phybullAddr,
    firstParams.phybullAbi
  );
  let erc20Address = await phybullContract.methods.erc20Address().call();
  let erc20Contract = getContractInstance(erc20Address, firstParams.erc20Abi);
  /// update this from UI or use cost of max claims
  let newAllowance = 100000;
  // update allowance
  if (confirm("Give this contract an allowance for your {} tokens ?")) {
    try {
      await erc20Contract.methods
        .approve(firstParams.phybullAddr, newAllowance)
        .send({ from: addr });
      return true;
    } catch {
      console.log("Txn rejected");
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Function to convert a bull ID to it's token ID
 */
function bullToTokenID(bullId) {
  let tokenId = web3.utils
    .toBN("340282366920938463463374607431768211456")
    .add(web3.utils.toBN(bullId));

  return tokenId;
}

/**
 * Function to convert a tokenId to a bull Id
 */
function tokenToBullId(tokenId) {
  let bn = web3.utils.toBN(tokenId);
  let bullId = bn.words[0];
  return bullId;
}

/**
 * Function to convert decimal tokenId -> hex 1155 json format (64 padded)
 * @notice tokenId must be a string
 */
function tokenToJson(tokenId) {
  let dec = web3.utils.toBN(tokenId);
  let hex = web3.utils.toHex(dec);
  let pad = 64 - hex.length + 2;
  let padded = "";
  for (let i = 0; i < pad; i++) {
    padded += "0";
  }
  padded += hex.substring(2);
  return padded + ".json";
}
