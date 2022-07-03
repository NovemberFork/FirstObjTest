// get values of inputs, pass to moralis

const myForm = document.getElementById("wf-form-frm-order");

myForm.addEventListener("submit", async function (e) {
  const errors = [];

  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;

  // Check inputs...

  let x = document.getElementById("w-form-done1"); //.style.display = "inline";
  let y = document.getElementById("w-form-fail1"); //.style.display = "none";
  let user = Moralis.User.current();
  console.log(user.get("name"));
  if (user) {
    if (
      confirm(
        `Are the following fields correct ?\n${name}\n${address}\n${phone}\n${email}\n`
      )
    ) {
      user.set("name", name);
      user.set("email", email);
      user.set("phone", phone);
      user.set("location", address);
      x.classList.add("show");
      y.classList.add("hide");
      await user.save();
      window.location = "shop.html";
    } else {
      y.classList.add("show");
      x.classList.add("hide");
      return;
    }
  } else {
    y.classList.add("show");
    x.classList.add("hide");
    return;
  }
  if (errors.length) {
    e.preventDefault(); // The browser will not make the HTTP POST request
    return;
  }
});

async function getAndPass() {
  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;

  let err = "The following input fields need values:\n";
  let key = 0;
  if (!name) {
    err += "Name\n";
    key += 1;
  }
  if (!address) {
    err += "Address\n";
    key += 1;
  }
  if (!phone) {
    err += "Phone\n";
    key += 1;
  }
  if (!email) {
    err += "Email Address\n";
    key += 1;
  }
  //   document.getElementsByClassName("w-form-done")[0].style.display = "inline";
  //   document.getElementsByClassName("w-form-fail")[0].style.display = "none";
  return true;
  if (key > 0) {
    alert(err);
    return;
  } else {
    console.log("pas");
  }
}
