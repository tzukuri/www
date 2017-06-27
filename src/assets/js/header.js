// TODO: rewrite without jquery
function checkScrollState() {
    var stickyHeader = $('body').attr('sticky-header') != undefined;
    var scrollTop = $(window).scrollTop();

    if(scrollTop > 18 || stickyHeader) {
        $('body > header').addClass('sticky');
    } else {
        $('body > header').removeClass('sticky');
    }
}

// the page may load at a certain scroll position (e.g after a reload)
// so set the correct scroll state on page load
$(window).on('load', function() {
    // move our fn call to the end of the event queue to give the browser
    // time to run its own scroll processing (e.g scrolling to # anchors)
    setTimeout(checkScrollState, 200);
});

$(function() {
    // whenever the window scrolls update the header scroll state
    $(window).scroll(checkScrollState);

    // whenever the window resizes the scroll position might change
    $(window).resize(checkScrollState);
});
