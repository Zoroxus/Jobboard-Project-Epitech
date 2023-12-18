// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins.

import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

//
// Place any custom JS here
//

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
.forEach(popover => {
  new bootstrap.Popover(popover)
})

export function unSign(){
  sessionStorage.removeItem("access_token");
  //console.log("Access Token : ", sessionStorage.getItem("access_token"));
  reload();
}