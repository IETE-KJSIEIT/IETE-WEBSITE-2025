document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

    // Three.js background
    const threeCanvasContainer = document.getElementById('three-canvas-container');
    if (threeCanvasContainer) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        threeCanvasContainer.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 10000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0x888888 });
    const points = new THREE.Points(geometry, material);

        scene.add(points);

        camera.position.z = 5;

        function animate() {
            requestAnimationFrame(animate);

            points.rotation.x += 0.0005;
            points.rotation.y += 0.0005;

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('content-container');
    const threeCanvas = document.getElementById('three-canvas-container');
    const percentageText = document.getElementById('loading-percentage');
    const progressBar = document.getElementById('progress-bar');
    
    if (splashScreen && mainContent && threeCanvas && percentageText && progressBar) {
        const loadingDuration = 3000;

        let currentPercentage = 0;
        const interval = setInterval(() => {
            if (++currentPercentage <= 100) {
                percentageText.textContent = `${currentPercentage}%`;
            } else {
                clearInterval(interval);
            }
        }, loadingDuration / 100);

        setTimeout(() => { progressBar.style.transform = 'scaleX(1)'; }, 50);

        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            splashScreen.addEventListener('animationend', () => {
                document.body.style.overflow = 'auto';
                mainContent.style.opacity = '1';
                threeCanvas.style.opacity = '1';
                // Show navbar after splash screen
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    navbar.classList.add('visible');
                }
                initScrollAnimations();
            }, { once: true });
        }, loadingDuration);
    } else {
        // If splash screen elements don't exist, just initialize animations
        document.body.style.overflow = 'auto';
        if (mainContent) mainContent.style.opacity = '1';
        if (threeCanvas) threeCanvas.style.opacity = '1';
        // Show navbar immediately if no splash screen
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.add('visible');
        }
        initScrollAnimations();
    }
    
    // Enhanced TextScramble Class
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    function initScrollAnimations() {
        // Welcome screen text scramble animation
        const welcomeLines = document.querySelectorAll('.welcome-line h1');
        const phrases = [
            ['WELCOME TO', 'IETE KJSIT'],
            ['LOADING...', 'SYSTEM...'],
        ];

        const scramble = (el, newText) => {
            const scrambleEffect = new TextScramble(el);
            scrambleEffect.setText(newText);
        }

        let counter = 0;
        const next = () => {
            scramble(welcomeLines[0], phrases[counter % phrases.length][0]);
            scramble(welcomeLines[1], phrases[counter % phrases.length][1]);
            counter++;
            setTimeout(next, 2000);
        };
        next();

        gsap.timeline({
            scrollTrigger: {
                trigger: '#welcome-screen',
                start: 'top top',
                end: '+=50%',
                scrub: 0.5,
                pin: true,
            }
        })
        .to(gsap.utils.toArray('.welcome-line')[0], { y: '-50vh', opacity: 0 }, 0)
        .to(gsap.utils.toArray('.welcome-line')[1], { y: '50vh', opacity: 0 }, 0);

        // Introduction section element reveal animation
        gsap.timeline({
            scrollTrigger: {
                trigger: '#introduction',
                start: 'top 70%',
                toggleActions: 'play none none reverse',
            }
        })
        .to('.intro-element', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Team section card reveal animation
        gsap.from('#team .team-card', {
            scrollTrigger: {
                trigger: '#team',
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Marquee sections reveal animation
        gsap.from('.marquee-container', {
            scrollTrigger: {
                trigger: '#team-groups',
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.subcore-marquee-container', {
            scrollTrigger: {
                trigger: '#subcore-team',
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        // Enhanced marquee interactions
        const marqueeContainers = document.querySelectorAll('.marquee-container, .subcore-marquee-container, .sponsors-marquee-container');
        marqueeContainers.forEach(container => {
            const track = container.querySelector('.marquee-track, .subcore-marquee-track, .sponsors-marquee-track');
            
            // Pause on hover
            container.addEventListener('mouseenter', () => {
                if (track) track.style.animationPlayState = 'paused';
            });
            
            container.addEventListener('mouseleave', () => {
                if (track) track.style.animationPlayState = 'running';
            });
            
            // Add click to focus on specific card
            const cards = container.querySelectorAll('.team-group-card, .subcore-card, .sponsor-card');
            cards.forEach((card, index) => {
                card.addEventListener('click', () => {
                    // Add a highlight effect
                    cards.forEach(c => c.classList.remove('highlighted'));
                    card.classList.add('highlighted');
                    
                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        card.classList.remove('highlighted');
                    }, 3000);
                });
            });
        });

         // Renaissance section element reveal animation
         gsap.timeline({
            scrollTrigger: {
                trigger: '#renaissance',
                start: 'top 70%', // Start animation a bit earlier
                toggleActions: 'play none none reverse',
            }
        })
        .from('.renaissance-element', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2, // Animates each element 0.2s after the previous one
            ease: 'power3.out'
        });

        // Handle the CTA button click with a simple smooth scroll
        const cyberBtn = document.querySelector('.cyber-btn');
        if (cyberBtn) {
            cyberBtn.addEventListener('click', (e) => {
                e.preventDefault();
                gsap.to(window, {
                    duration: 1, 
                    scrollTo: '#renaissance', 
                    ease: 'power2.inOut' 
                });
            });
        }
          // About Us section scrollytelling animation
          gsap.timeline({
            scrollTrigger: {
                trigger: '#about-us',
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            }
        })
        .from('.about-element', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Animated statistics counter
        gsap.utils.toArray('.stat-number').forEach(element => {
            const finalValue = parseInt(element.getAttribute('data-final-value'), 10);
            
            gsap.fromTo(element, 
                { innerText: 0 }, 
                {
                    innerText: finalValue,
                    duration: 2.5,
                    ease: 'power2.out',
                    // Use snap to round to whole numbers
                    snap: { innerText: 1 },
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%', // Start when the number is 85% from the top
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    // Navbar scroll behavior
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: targetSection,
                    ease: 'power2.inOut'
                });
            }
        });
    });

    // Hero Section Scroll Indicator
    const scrollIndicator = document.querySelector('.scroll-arrow');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: '#introduction',
                ease: 'power2.inOut'
            });
        });
    }


    // Enhanced Hero Section Animations
    function initHeroAnimations() {
        // Animate particles on mouse move
        const particles = document.querySelectorAll('.particle');
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                
                gsap.to(particle, {
                    x: x,
                    y: y,
                    duration: 2,
                    ease: 'power2.out'
                });
            });
        });

        // Parallax effect for hero elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    // Initialize hero animations after splash screen
    setTimeout(() => {
        initHeroAnimations();
    }, 1000);

    // Footer Title Rise Animation
    function initFooterAnimation() {
        const footerTitle = document.querySelector('.footer-title-animate');
        if (!footerTitle) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a small delay for better effect
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 200);
                }
            });
        }, {
            threshold: 0.3, // Trigger when 30% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully in view
        });

        observer.observe(footerTitle);
    }

    // Initialize footer animation
    initFooterAnimation();
});