// inject partials
(() => {
  $("header").load('/html/partials/top-nav.html');
  $("footer").load('/html/partials/menu-bar.html');
})
();

$(document).ready(() => {
  const hamburger = $(".top-nav__hamburger");
  const hamburger__nav = $(".top-nav__hamburger__nav")

  hamburger.on("click", () => {
    hamburger.toggleClass("active");
    hamburger__nav.toggleClass("active");
  })
})
