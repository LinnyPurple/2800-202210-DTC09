// inject partials
(() => {
  $("header").load('/html/partials/top-nav.html');
  $("footer").load('/html/partials/menu-bar.html');
})
();

$(document).ready(() => {
  $("body").on("click", ".top-nav__hamburger", () => {
    $(".top-nav__hamburger").toggleClass("active");
    $(".top-nav__hamburger__nav").toggleClass("active");
  })
})
