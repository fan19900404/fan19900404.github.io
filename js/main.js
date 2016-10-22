/**
 * some JavaScript code for this blog theme
 */
/* jshint asi:true */

/////////////////////////header////////////////////////////
/**
 * clickMenu
 */
(function() {
    if (window.innerWidth <= 770) {
        var menuBtn = document.querySelector('#headerMenu')
        var nav = document.querySelector('#headerNav')
        menuBtn.onclick = function(e) {
            e.stopPropagation()
            if (menuBtn.classList.contains('active')) {
                menuBtn.classList.remove('active')
                nav.classList.remove('nav-show')
            } else {
                nav.classList.add('nav-show')
                menuBtn.classList.add('active')
            }
        }
        document.querySelector('body').addEventListener('click', function() {
            nav.classList.remove('nav-show')
            menuBtn.classList.remove('active')
        })
    }
}());


//////////////////////////back to top////////////////////////////
(function() {
    var backToTop = document.querySelector('.back-to-top')
    var backToTopA = document.querySelector('.back-to-top a')
        // console.log(backToTop);
    window.addEventListener('scroll', function() {


        // 页面顶部滚进去的距离
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)

        if (scrollTop > 200) {
            backToTop.classList.add('back-to-top-show')
        } else {
            backToTop.classList.remove('back-to-top-show')
        }
    })

}());

document.addEventListener("DOMContentLoaded",function(){var e=function(){if("scrollingElement"in document)return document.scrollingElement;var a=document.documentElement,b=a.scrollTop;a.scrollTop=b+1;var c=a.scrollTop;a.scrollTop=b;return c>b?a:document.body}(),g=function(a){var b=e.scrollTop;if(2>a.length)a=-b;else if(a=document.querySelector(a)){a=a.getBoundingClientRect().top;var c=e.scrollHeight-window.innerHeight;a=b+a<c?a:c-b}else a=void 0;if(a)return new Map([["start",b],["delta",a]])},h=function(a){var b=
a.getAttribute("href"),c=g(b);if(c){var d=new Map([["duration",800]]),k=performance.now();requestAnimationFrame(function l(a){d.set("elapsed",a-k);a=d.get("duration");var f=d.get("elapsed"),g=c.get("start"),h=c.get("delta");e.scrollTop=Math.round(h*(-Math.pow(2,-10*f/a)+1)+g);d.get("elapsed")<d.get("duration")?requestAnimationFrame(l):(history.pushState(null,null,b),e.scrollTop=c.get("start")+c.get("delta"))})}},f=document.querySelectorAll("a.scroll");(function b(c,d){var e=c.item(d);e.addEventListener("click",
function(b){b.preventDefault();h(e)});if(d)return b(c,d-1)})(f,f.length-1)});