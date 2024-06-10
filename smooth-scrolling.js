const smooths = document.querySelectorAll('.smooth');
const achievements = document.querySelector('.achievements');
const achievContent = document.querySelector('.achiev-content');

let sx = 0, // For scroll positions
    sy = 0;
let dx = sx, // For container positions
    dy = sy;

// Bind a scroll function
window.addEventListener('scroll', easeScroll);

// Calculate the initial scroll position
const initialSX = window.scrollX;
const initialSY = window.scrollY;

function easeScroll() {
    sx = window.scrollX;
    sy = window.scrollY;
}

window.requestAnimationFrame(render);

function render() {
  smooths.forEach(smooth => {
        //We calculate our container position by linear interpolation method
        dx = li(dx, sx, 0.007);
        dy = li(dy, sy, 0.007);

        dx = Math.floor(dx * 100) / 100;
        dy = Math.floor(dy * 100) / 100;

        smooth.style.transform = `translate3d(-${dx}px, -${dy}px, 0px)`;
    });

    window.requestAnimationFrame(render);
}

function li(a, b, n) {
  return (1 - n) * a + n * b;
}