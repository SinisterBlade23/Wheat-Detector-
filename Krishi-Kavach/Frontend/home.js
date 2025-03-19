document.addEventListener('DOMContentLoaded', function() {
    // Load required libraries dynamically
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', function() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', function() {
            initializeAnimations();
        });
    });
    
    // Add disease classes data
    const diseaseClasses = {
        pests: ['Aphid', 'Mite', 'Stem Fly'],
        rusts: ['Black Rust / Stem Rust', 'Brown Rust / Leaf Rust', 'Yellow Rust / Stripe Rust'],
        others: [
            'Smut (Loose, Flag)',
            'Common Root Rot',
            'Helminthosporium Leaf Blight / Leaf Blight',
            'Wheat Blast',
            'Fusarium head blight / Scab',
            'Septoria Leaf Blotch',
            'Spot Blotch',
            'Tan Spot',
            'Powdery Mildew'
        ]
    };

    // Handle Scan Your Crop button click with enhanced effects
    const scanButton = document.querySelector('.scan-btn');
    scanButton.addEventListener('click', function() {
        // Add button press effect
        this.classList.add('button-pressed');
        setTimeout(() => this.classList.remove('button-pressed'), 200);
        
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        // Add file input to body and trigger click
        document.body.appendChild(fileInput);
        fileInput.click();
        
        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                
                // Create and show loading overlay
                const overlay = document.createElement('div');
                overlay.className = 'analysis-overlay';
                overlay.innerHTML = `
                    <div class="analysis-container">
                        <div class="spinner"></div>
                        <h3>Analyzing your crop...</h3>
                        <p>Our AI is scanning for diseases including:</p>
                        <div class="disease-ticker" id="diseaseTicker"></div>
                    </div>
                `;
                document.body.appendChild(overlay);
                
                // Animate overlay entrance
                gsap.fromTo(overlay, {opacity: 0}, {opacity: 1, duration: 0.5});
                
                // Create disease ticker effect
                let tickerIndex = 0;
                const tickerElement = document.getElementById('diseaseTicker');
                const allDiseases = [...diseaseClasses.pests, ...diseaseClasses.rusts, ...diseaseClasses.others];
                
                const tickerInterval = setInterval(() => {
                    tickerElement.textContent = allDiseases[tickerIndex];
                    gsap.fromTo(tickerElement, 
                        {opacity: 0, y: 20}, 
                        {opacity: 1, y: 0, duration: 0.3}
                    );
                    tickerIndex = (tickerIndex + 1) % allDiseases.length;
                }, 800);
                
                // Simulate analysis completion after 3 seconds
                setTimeout(function() {
                    clearInterval(tickerInterval);
                    
                    // Update overlay with completion message
                    overlay.querySelector('.analysis-container').innerHTML = `
                        <div class="success-checkmark">✓</div>
                        <h3>Analysis Complete!</h3>
                        <p>We've identified potential issues with your crop.</p>
                        <button class="view-results-btn">View Detailed Results</button>
                    `;
                    
                    // Add click event to results button
                    overlay.querySelector('.view-results-btn').addEventListener('click', function() {
                        gsap.to(overlay, {
                            opacity: 0, 
                            duration: 0.5,
                            onComplete: () => {
                                document.body.removeChild(overlay);
                                window.location.href = 'dashboard.html';
                            }
                        });
                    });
                    
                }, 3000);
            }
            
            // Remove the file input from the DOM
            document.body.removeChild(fileInput);
        });
    });
    
    // Add smooth scrolling for anchor links with enhanced behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add ripple effect on click
                const ripple = document.createElement('div');
                ripple.className = 'ripple-effect';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    this.removeChild(ripple);
                }, 600);
                
                // Smooth scroll with GSAP
                gsap.to(window, {
                    duration: 1, 
                    scrollTo: {
                        y: targetElement,
                        offsetY: 50
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });
    
    // Enhanced hover effects for feature cards with GSAP
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -15,
                boxShadow: '0px 15px 30px rgba(40, 167, 69, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                duration: 0.3
            });
            
            // Animate the icon
            const icon = this.querySelector('.icon-box img');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                duration: 0.3
            });
            
            // Reset icon animation
            const icon = this.querySelector('.icon-box img');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3
                });
            }
        });
    });
    
    // Enhanced step circles animation with GSAP ScrollTrigger
    function initializeAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section entrance animation
        gsap.from('.hero h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: "power3.out"
        });
        
        gsap.from('.hero p', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: "power3.out"
        });
        
        gsap.from('.cta-buttons', {
            duration: 1,
            y: 20,
            opacity: 0,
            delay: 0.6,
            ease: "power3.out"
        });
        
        // Animate step circles on scroll
        const stepCircles = document.querySelectorAll('.step-circle');
        stepCircles.forEach((circle, index) => {
            gsap.from(circle, {
                scrollTrigger: {
                    trigger: circle,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                scale: 0.5,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: "back.out(1.7)"
            });
        });
        
        // Animate steps content
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            gsap.from(step.querySelector('h3'), {
                scrollTrigger: {
                    trigger: step,
                    start: "top 75%"
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                delay: 0.3 + (index * 0.2)
            });
            
            gsap.from(step.querySelector('p'), {
                scrollTrigger: {
                    trigger: step,
                    start: "top 75%"
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                delay: 0.5 + (index * 0.2)
            });
        });
        
        // Animate CTA section
        gsap.from('.cta-text h2', {
            scrollTrigger: {
                trigger: '.cta-container',
                start: "top 70%"
            },
            x: -50,
            opacity: 0,
            duration: 0.8
        });
        
        gsap.from('.cta-text p', {
            scrollTrigger: {
                trigger: '.cta-container',
                start: "top 70%"
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            delay: 0.2
        });
        
        gsap.from('.cta-button', {
            scrollTrigger: {
                trigger: '.cta-container',
                start: "top 70%"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.4
        });
        
        gsap.from('.cta-image img', {
            scrollTrigger: {
                trigger: '.cta-container',
                start: "top 70%"
            },
            x: 50,
            opacity: 0,
            duration: 0.8
        });
    }
    
    // Utility function to load scripts dynamically
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }
    
    // Add CSS for the enhanced animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .button-pressed {
            transform: scale(0.95);
            transition: transform 0.1s;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            animation: ripple 0.6s;
            opacity: 0;
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 0.5;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }
        
        .analysis-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .analysis-container {
            background-color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #28a745;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .disease-ticker {
            font-weight: bold;
            color: #28a745;
            height: 30px;
            margin: 15px 0;
        }
        
        .success-checkmark {
            color: #28a745;
            font-size: 48px;
            margin-bottom: 20px;
        }
        
        .view-results-btn {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.3s;
        }
        
        .view-results-btn:hover {
            background-color: #218838;
        }
    `;
    document.head.appendChild(style);
});
