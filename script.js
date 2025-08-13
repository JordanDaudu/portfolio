//turn pages when clicking next or prev buttons
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) =>
    el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);

        if(pageTurn.classList.contains('turn')) {
            pageTurn.classList.remove('turn');
            setTimeout(() => {
                pageTurn.style.zIndex = 20 - index;
            }, 500)
        }
        else {
            pageTurn.classList.add('turn');
            setTimeout(() => {
                pageTurn.style.zIndex = 20 + index;
            }, 500)
        }
    })

// contact me button when clicked
const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');

contactMeBtn.onclick = () => {
    pages.forEach((page, index) => {
        setTimeout(() => {
            page.classList.add('turn');

            setTimeout(() => {
                page.style.zIndex = 20 + index;
            }, 500)

        }, (index + 1) * 200 + 100)
    })
}

// create reverse index function
let totalPages = pages.length;
let pageNumber = 0;

function reverseIndex() {
    pageNumber--;
    if(pageNumber < 0) {
        pageNumber = totalPages - 1
    }
}

// back profile button when clicked
const backProfileBtn = document.querySelector('.back-profile')

backProfileBtn.onclick = () => {
    pages.forEach((_, index) => {
        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].classList.remove('turn');

            setTimeout(() => {
                reverseIndex();
                pages[pageNumber].style.zIndex = 10 + index;
            }, 500)

        }, (index + 1) * 200 + 100)
    })
}

// opening animation
const coverRight = document.querySelector('.cover.cover-right');
const pageLeft = document.querySelector('.book-page.page-left');

// opening animation (cover right animation)
setTimeout(() => {
    coverRight.classList.add('turn')
}, 2100)

setTimeout(() => {
    coverRight.style.zIndex = -1
}, 2800)

// opening animation (page left or profile page animation)
setTimeout(() => {
    pageLeft.style.zIndex = 20
}, 3200)

// opening animation (all page right animation)
pages.forEach((_, index) => {
    setTimeout(() => {
        reverseIndex();
        pages[pageNumber].classList.remove('turn');

        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].style.zIndex = 10 + index;
        }, 500)

    }, (index + 1) * 200 + 2100)
})

// Initialize EmailJS
emailjs.init("R0utPOQL6b1GWX9nr"); // public key

// Handle contact form submission
document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

    // Set the current time for the {{time}} variable
    document.getElementById("current-time").value = new Date().toLocaleString();

    emailjs.sendForm("service_cu7im4k", "template_d2kqomf", this) // serviceID, templateID, this
        .then(() => {
            alert("✅ Message sent successfully!");
            this.reset(); // clear form after success
        })
        .catch(error => {
            alert("❌ Failed to send message. Error: " + JSON.stringify(error));
        });
});

// MOBILE DRAG-TO-SCROLL AND PINCH-TO-ZOOM
if (window.innerWidth <= 1024 || window.innerHeight <= 768) {
    const wrapper = document.querySelector('.wrapper');
    let isDragging = false;
    let isPinching = false;
    let startX, startY, scrollLeft, scrollTop;
    let initialDistance = 0;
    let scale = 1;
    let originX = 0;
    let originY = 0;

    wrapper.style.transformOrigin = "0 0"; // set default origin

    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            scrollLeft = wrapper.scrollLeft;
            scrollTop = wrapper.scrollTop;
        } else if (e.touches.length === 2) {
            isDragging = false;
            isPinching = true;
            initialDistance = getDistance(e.touches[0], e.touches[1]);

            // Calculate midpoint for zoom origin
            originX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            originY = (e.touches[0].pageY + e.touches[1].pageY) / 2;

            // Convert to percentage for transform-origin
            const rect = wrapper.getBoundingClientRect();
            const percentX = ((originX - rect.left) / rect.width) * 100;
            const percentY = ((originY - rect.top) / rect.height) * 100;
            wrapper.style.transformOrigin = `${percentX}% ${percentY}%`;
        }
    });

    wrapper.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            const touch = e.touches[0];
            const x = touch.pageX;
            const y = touch.pageY;
            wrapper.scrollLeft = scrollLeft - (x - startX);
            wrapper.scrollTop = scrollTop - (y - startY);
            e.preventDefault();
        } else if (isPinching && e.touches.length === 2) {
            const newDistance = getDistance(e.touches[0], e.touches[1]);
            const zoomFactor = newDistance / initialDistance;
            scale = Math.min(Math.max(zoomFactor, 0.5), 3); // clamp zoom
            wrapper.style.transform = `scale(${scale})`;
            e.preventDefault();
        }
    });

    wrapper.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
            isDragging = false;
            isPinching = false;
        }
    });

    function getDistance(touch1, touch2) {
        const dx = touch2.pageX - touch1.pageX;
        const dy = touch2.pageY - touch1.pageY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

