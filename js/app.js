const observerOpacity = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-opacity');
            observer.unobserve(entry.target); // Stop observing after the element is shown
        }
    });
}, { threshold: 0.5 });

const hiddenElementsOpacity = document.querySelectorAll('.hidden-opacity');
hiddenElementsOpacity.forEach((el) => observerOpacity.observe(el));

const observerSlide = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-slide');
            observer.unobserve(entry.target); // Stop observing after the element is shown
        }
    });
}, { threshold: 0.5 });

const hiddenElementsSlide = document.querySelectorAll('.hidden-slide');
hiddenElementsSlide.forEach((el) => observerSlide.observe(el));