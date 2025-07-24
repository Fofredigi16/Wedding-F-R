function getNamaTamu() {
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get("to");
  if (nama) {
    document.getElementById("gstName").textContent = decodeURIComponent(nama);
  }
}
window.onload = getNamaTamu;
