// The function to load navbars and footer
function loadSkeleton() {
    console.log($('#topnavbarPlaceholder').load('../html/partials/top-nav.html'));
    console.log($('#bottomnavbarPlaceholder').load('../html/partials/menu-bar.html'));
}

// call the functions inside
function setup() {
    loadSkeleton();
}

// call the setup function when page is ready
$(document).ready(setup);