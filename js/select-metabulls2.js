document.getElementById("redeem-btn").addEventListener("click", claimMetaBulls);
var astroIds = JSON.parse(localStorage.getItem("ToClaim"));

async function setTheseClaimers() {
  //   let astroIds = localStorage.getItem("ToClaim");
  let gallary = document.getElementById("to-use-gal");
  /// set bulls being used
  for (let i = 0; i < astroIds.length; i++) {
    gallary.appendChild(await makeThing2(astroIds[i]));
  }
}
async function claimMetaBulls() {
  let key = 0;
  let errorMsg = "Error:\n";
  let mContract = getContractInstance(metabullAddr, metaABI);
  let bContract = getContractInstance(burger, burgerABI);
  let isMinting = await mContract.methods.isMinting().call();

  if (!isMinting) {
    errorMsg += "minting is not active\n";
    key += 1;
  }
  if (astroIds.length == 0) {
    errorMsg += "must use > 0 bulls\n";
    key += 1;
  }
  // check if metacontract is burner;
  let isBurner = await bContract.methods.burners(metabullAddr).call();
  if (!isBurner) {
    key += 1;
    errorMsg += "metabull contract not set as burner\n";
  }
  let burgerBalance = await bContract.methods.balanceOf(addr).call();
  let toBurn = await mContract.methods.burnScalar().call();
  if (burgerBalance < toBurn * astroIds.length) {
    errorMsg += "insufficient burger balance\n";
    key += 1;
  }
  if (key == 0) {
    if (confirm("Claim" + astroIds.length + " metabulls?") == true) {
      await mContract.methods.claimBull(astroIds).send({ from: addr });
    }
    run();
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
    alert(errorMsg);
  }
}

async function makeThing2(tokenId) {
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

  /// set texts
  ele1.innerText = "AstroBull #" + bullId;
  ele2.innerText = "#" + bullId;
  return ele;
}
