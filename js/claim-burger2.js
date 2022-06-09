let just = localStorage.getItem("JustClaimed");
console.log(just);
if (just) {
  document.getElementById("just-claimed").innerText = just;
} else {
  document.getElementById("just-claimed").innerText = 0;
}
