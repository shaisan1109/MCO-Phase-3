// When the user scrolls the page, execute myFunction
window.onscroll = function() { stickyNav(); };

// <nav> element
let nav = document.getElementsByTagName('nav')[0];

// Returns y offset of nav
let sticky = nav.offsetTop;

// Append .sticky class when scroll reaches nav
// Otherwise, keep nav in default position
function stickyNav() {
  if (window.pageYOffset >= sticky) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
}