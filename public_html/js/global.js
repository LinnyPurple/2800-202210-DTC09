// inject partials
(() => {
  $("header").load('/html/partials/top-nav.html');
  $("footer").load('/html/partials/menu-bar.html');
})
();

async function logout() {
  let res = await getRequest("/api/logout");
  console.log(res);
  window.location.assign('/login');
}

$(document).ready(() => {
  $("body").on("click", ".top-nav__hamburger", () => {
    $(".top-nav__hamburger").toggleClass("active");
    $(".top-nav__hamburger__nav").toggleClass("active");
  })
})

