document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = parseInt(target.getAttribute('data-animation-delay')) || 0;

                target.classList.add('is-visible');

                if (delay > 0) {
                    target.style.animationDelay = `${delay}ms`;
                }

                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Select all elements that should animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    document.querySelectorAll('.project-card, .skill-item').forEach(element => {
        observer.observe(element);
    });


    // --- Initial Animations for Header and Nav ---
    document.querySelectorAll('nav, header h1, header p, header div').forEach(element => {
        const delay = parseInt(element.getAttribute('data-animation-delay')) || 0;
        if (delay > 0) {
            setTimeout(() => {
                element.classList.add('is-visible');
            }, delay);
        } else {
            element.classList.add('is-visible');
        }
    });


    // --- Scroll to Top Button Logic ---
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add("show");
        } else {
            scrollToTopBtn.classList.remove("show");
        }
    });

    // Smooth scroll to top when button is clicked
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // --- Background Star Animation ---
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 90;

    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Star class definition
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speed = Math.random() * 0.5 + 0.1;
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }

        update() {
            this.y += this.speed;
            if (this.y > canvas.height) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
                this.size = Math.random() * 1.5 + 0.5;
                this.speed = Math.random() * 0.5 + 0.1;
                this.opacity = Math.random() * 0.5 + 0.5;
            }
        }
    }

    // Initialize stars
    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    // Animation loop
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(100, 100, 200, 0.05)');
        gradient.addColorStop(0.5, 'rgba(50, 50, 150, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animateStars);
    }

    // Event listeners for canvas
    window.addEventListener('resize', () => {
        resizeCanvas();
        initStars();
    });

    // Initial setup
    resizeCanvas();
    initStars();
    animateStars();
});


document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('is-flipped');
    });
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('stay-flipped')) {
            card.classList.remove('is-flipped');
        }
    });


    card.querySelectorAll('.flip-trigger').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation(); 
            card.classList.toggle('is-flipped'); 
            if (card.classList.contains('is-flipped')) {
                card.classList.add('stay-flipped');
            } else {
                card.classList.remove('stay-flipped');
            }
        });
    });
});
