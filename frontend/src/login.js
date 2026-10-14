// login.css is linked directly in index.html's <head> rather than imported here, so it
// loads as a blocking stylesheet instead of flashing unstyled content while this JS loads.

// The form emits credentials; the page owns the login integration.
// TODO (#49): Replace this temporary event inspection with the real login API call.
// document.querySelector("#login-form-container").addEventListener("login-submit", (event) => {
//   console.log(event.detail);
// });


// Zia modified this 

const container = document.querySelector("#login-form-container");

container.addEventListener("login-submit", () => {
  window.location.href = "./dashboard.html";
});