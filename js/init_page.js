let appPage = window.location.pathname.includes("app");
function load_head() {
  $('body').prepend(`
  <div class="header">
    <h3>Welcome to [NAME OF SITE]</h3>
    <div id="${appPage ? "home" : "login"}-icon" onclick="window.location.href='../${appPage ? "" : "login"}'"></div>
  </div>
`);
}
// document.onloadend = load_head();
$(document).ready(load_head);
