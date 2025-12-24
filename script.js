document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    // Toggle Mobile Menu
    mobileNavToggle.addEventListener('click', () => {
        const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
        mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        mobileNavToggle.classList.toggle('open');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileNavToggle.classList.remove('open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Simple Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Scroll Spy for Navigation Highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset for sticky header
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.main-nav a[href*="${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    // Initial call to set active state on load
    scrollSpy();

    // Fetch and render News (Aktuelles)
    function loadNews() {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;

        try {
            // Check if newsData is defined (from aktuelles.js)
            if (typeof newsData === 'undefined') {
                throw new Error('News-Daten konnten nicht gefunden werden.');
            }
            
            if (newsData.length === 0) {
                newsContainer.innerHTML = '<p class="loading-text">Aktuell gibt es keine Neuigkeiten.</p>';
                return;
            }

            newsContainer.innerHTML = ''; // Clear loading text

            newsData.forEach(item => {
                const card = document.createElement('article');
                card.className = 'news-card fade-in';
                
                let imageHtml = '';
                if (item.bild) {
                    imageHtml = `<img src="${item.bild}" alt="${item.titel}" class="news-image">`;
                }

                card.innerHTML = `
                    ${imageHtml}
                    <div class="news-content">
                        <span class="news-date">${item.datum}</span>
                        <h3>${item.titel}</h3>
                        <p class="news-text">${item.text}</p>
                    </div>
                `;
                newsContainer.appendChild(card);
                
                // Observe new card for fade-in
                if (typeof observer !== 'undefined') {
                    observer.observe(card);
                }
            });

        } catch (error) {
            console.error('Error loading news:', error);
            newsContainer.innerHTML = '<p class="loading-text">Aktuelles konnte nicht geladen werden. Bitte versuchen Sie es später erneut.</p>';
        }
    }

    loadNews();

    // Email Obfuscation Protection
    // Assemble email: brandenstein [at] posteo.de
    const user = 'brandenstein';
    const domain = 'posteo.de';
    const email = `${user}@${domain}`;
    
    document.querySelectorAll('.protected-email').forEach(el => {
        // Set the visible text if it's empty or needs replacing
        if (el.textContent === '' || el.textContent.includes('(at)')) {
            el.textContent = email;
        }
        
        // Wrap in a link if requested
        if (el.dataset.mailto === 'true') {
            el.style.cursor = 'pointer';
            el.addEventListener('click', (e) => {
                window.location.href = `mailto:${email}`;
            });
        }
    });
});
