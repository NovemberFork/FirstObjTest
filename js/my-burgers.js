// set a user's burgers
async function setMyBurgers() {
  var bCount = document.getElementById("burger-bal");
  if (addr != "") {
    var burgerContract = getContractInstance(burger, burgerABI);
    bCount.innerText = await burgerContract.methods.balanceOf(addr).call();
  } else {
    bCount.innerText = "#";
  }
}
