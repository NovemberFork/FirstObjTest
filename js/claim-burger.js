async function setBurgersAvailable() {
  let bContract = getContractInstance(burger, burgerABI);
  let tokensLeft = await bContract.methods.tokenClaimsLeft(addr).call();
  document.getElementById("claim-burger").innerText = tokensLeft;

  document
    .getElementById("btn-redeem")
    .addEventListener("click", claimTheseBurgers);
}

var JustClaimed = 0;

async function claimTheseBurgers() {
  let count = parseInt(document.getElementById("burger-counting").value);
  let key = 0;
  let errorMsg = "error: ";
  if (!count) {
    errorMsg += "enter an integer amount, ";
    key += 1;
  }
  let bContract = getContractInstance(burger, burgerABI);
  let isClaiming = await bContract.methods.isClaiming().call();
  if (!isClaiming) {
    errorMsg += "claiming not active, ";
    key += 1;
  }
  let tokensLeft = await bContract.methods.tokenClaimsLeft(addr).call();
  if (count > tokensLeft) {
    errorMsg += "not enough claims left, ";
    key += 1;
  }
  if (key == 0) {
    if (confirm("Claim " + count + " burgers?")) {
      //claim
      try {
        await bContract.methods.claimBurgers(count).send({ from: addr });
        JustClaimed = count;
        localStorage.setItem("JustClaimed", count);
        window.location = "claim-burger-redeem.html";
      } catch (error) {
        console.log("txn rejected or reverted");
      }
    }
  } else {
    errorMsg += "try again";
    console.log(errorMsg);
  }
}
