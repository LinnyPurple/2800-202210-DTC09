// inject partials
(() => {
  $("header").load('/html/partials/top-nav.html');
  $(".bottom-nav").load('/html/partials/menu-bar.html');
})
();

$(document).ready(() => {
  const hamburger = $(".top-nav__hamburger");

  hamburger.on("click", () => {
    hamburger.toggleClass("active");
  })
})
