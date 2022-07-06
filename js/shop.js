async function setInitShop() {
  let mContract = getContractInstance(metabullAddr, metaABI);
  let pContract = getContractInstance(phybullAddr, phyABI);
  let sizeOfList = await pContract.methods.maxClaims().call();
  let burnScalar = await pContract.methods.burnScalar().call();
  let burnScalar2 = await mContract.methods.burnScalar().call();
  let erc20Cost = await pContract.methods.erc20Cost().call();
  let erc20Address = await pContract.methods.erc20().call();
  let eContract = getContractInstance(erc20Address, erc20ABI);
  let bal20 = await eContract.methods.balanceOf(addr).call();
  let dec = await eContract.methods.decimals().call();
  let price = (erc20Cost / 10 ** dec).toFixed(2);

  let shop1 = document.getElementById("shop1.0");
  let shop2 = document.getElementById("shop1.1");
  let shop3 = document.getElementById("shop1.2");
  let shop4 = document.getElementById("shop1.3");

  shop1.innerText = burnScalar2;
  shop2.innerText = "$" + price;
  shop3.innerText = burnScalar;
  shop4.innerText = burnScalar;

  // document.getElementById("shop11").innerHTML =
  //   "- " +
  //   burnScalar2 +
  //   " Burgers are required for 1 Metaverse AstroBull (MetaBull)<br />- You need to have each AstroBull in your wallet or in the Grill <br />- Choose 1 AstroBull to create a MetaBull <br />- MetaBull will inherit the traits of the Original AstroBull";
  // document.getElementById("shop22").innerHTML =
  //   "- Physical Collectibles are available for $" +
  //   price +
  //   " + " +
  //   burnScalar +
  //   " Burger each<br />- You need to have at least 1 AstroBull in your wallet or in the Grill <br />- Burns " +
  //   burnScalar +
  //   " Burger per redemption<br />- AstroBull Collectibles will be delivered to your physical address";
}
