document.addEventListener("DOMContentLoaded", function() {
    // ======================
    // Intersection Observer
    // ======================
    const initScrollAnimations = () => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.15
        };

        const handleIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const delay = target.dataset.animationDelay || 0;

                    // Set delay if specified
                    if (delay > 0) {
                        target.style.setProperty('--animation-delay', `${delay}ms`);
                    }

                    target.classList.add('is-visible');
                    observer.unobserve(target);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('[data-animate], .animate-on-scroll, .project-card, .skill-item').forEach(el => {
            observer.observe(el);
        });
    };

    // ======================
    // Initial Animations
    // ======================
    const initInitialAnimations = () => {
        document.querySelectorAll('nav, header h1, header p, header div').forEach(el => {
            const delay = el.dataset.animationDelay || 0;

            if (delay > 0) {
                setTimeout(() => el.classList.add('is-visible'), delay);
            } else {
                el.classList.add('is-visible');
            }
        });
    };

    // ======================
    // Scroll to Top Button
    // ======================
    const initScrollToTop = () => {
        const scrollToTopBtn = document.getElementById("scrollToTopBtn");
        const scrollThreshold = 300;
        let isScrolling = false;

        const toggleButton = () => {
            if (window.scrollY > scrollThreshold) {
                scrollToTopBtn.classList.add("show");
            } else {
                scrollToTopBtn.classList.remove("show");
            }
        };

        const smoothScroll = () => {
            if (isScrolling) return;

            isScrolling = true;
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            // Reset flag after scroll completes
            setTimeout(() => isScrolling = false, 1000);
        };

        window.addEventListener("scroll", toggleButton);
        scrollToTopBtn.addEventListener("click", smoothScroll);
    };

    // ======================
    // Starfield Animation
    // ======================
    const initStarfield = () => {
        const canvas = document.getElementById('backgroundCanvas');
        const ctx = canvas.getContext('2d');
        const numStars = window.innerWidth < 768 ? 60 : 120;
        let stars = [];
        let animationId;

        class Star {
            constructor() {
                this.reset(true);
                this.velocity = Math.random() * 0.5 + 0.1;
            }

            reset(initial = false) {
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : -10;
                this.size = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.5;
                this.flickerSpeed = Math.random() * 0.05 + 0.01;
            }

            draw() {
                // Flickering effect
                const flicker = Math.sin(Date.now() * this.flickerSpeed) * 0.2 + 0.8;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * flicker})`;
                ctx.fill();
            }

            update() {
                this.y += this.velocity;
                if (this.y > canvas.height + 10) this.reset();
            }
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = Array.from({ length: numStars }, () => new Star());
        };

        const drawGradientBackground = () => {
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
            gradient.addColorStop(0, 'rgba(100, 100, 200, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGradientBackground();

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            animationId = requestAnimationFrame(animate);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        };

        // Initialize
        resizeCanvas();
        animate();

        // Event listeners
        window.addEventListener('resize', () => {
            resizeCanvas();
            if (stars.length < numStars * 0.5) initStars();
        });

        document.addEventListener('visibilitychange', handleVisibilityChange);
    };

    // ======================
    // Flip Card Interactions
    // ======================
    const initFlipCards = () => {
        document.querySelectorAll('.flip-card').forEach(card => {
            let isFlipped = false;
            let hoverTimeout;
            const flipDuration = 800; // Match CSS transition duration

            const flipCard = (shouldFlip) => {
                clearTimeout(hoverTimeout);

                if (shouldFlip) {
                    card.classList.add('is-flipped');
                    isFlipped = true;
                } else {
                    card.classList.remove('is-flipped');
                    isFlipped = false;
                }
            };

            // Mouse interactions
            card.addEventListener('mouseenter', () => {
                if (!isFlipped) {
                    hoverTimeout = setTimeout(() => flipCard(true), 200);
                }
            });

            card.addEventListener('mouseleave', () => {
                if (isFlipped && !card.classList.contains('stay-flipped')) {
                    hoverTimeout = setTimeout(() => flipCard(false), 200);
                }
            });

            // Click interactions
            card.querySelectorAll('.flip-trigger').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    clearTimeout(hoverTimeout);
                    const shouldFlip = !isFlipped;
                    flipCard(shouldFlip);

                    if (shouldFlip) {
                        card.classList.add('stay-flipped');
                    } else {
                        card.classList.remove('stay-flipped');
                    }
                });
            });

            // Touch support for mobile
            card.addEventListener('touchstart', () => {
                flipCard(!isFlipped);
                card.classList.toggle('stay-flipped');
            }, { passive: true });
        });
    };

    // Initialize all components
    initScrollAnimations();
    initInitialAnimations();
    initScrollToTop();
    initStarfield();
    initFlipCards();
});