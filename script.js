document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animatableElements = entry.target.querySelectorAll('.animatable-content');
                animatableElements.forEach(el => {
                    if (!el.classList.contains('is-visible')) { // ตรวจสอบก่อนเพิ่ม class
                        el.classList.add('is-visible');
                    }
                });
                // Optional: Unobserve the section after animation to prevent re-triggering
                // observer.unobserve(entry.target);
            } else {
                // Optional: Reset animation if section scrolls out of view
                // This might be desired if you want the animation to replay every time.
                // const animatableElements = entry.target.querySelectorAll('.animatable-content.is-visible');
                // animatableElements.forEach(el => {
                //     el.classList.remove('is-visible');
                // });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Accordion JavaScript
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionContent = header.nextElementSibling;

            // Toggle active class for styling (optional)
            header.classList.toggle('active');
            // Toggle display of content
            accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
        });
    });

    // New Collapse All Accordion Button JavaScript for each accordion group
    const collapseTriggers = document.querySelectorAll('.accordion-collapse-trigger');
    collapseTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const accordionWrapper = button.closest('.accordion-with-controls');
            if (accordionWrapper) {
                const accordionElement = accordionWrapper.querySelector('.accordion');
                if (accordionElement) {
                    const contents = accordionElement.querySelectorAll('.accordion-content');
                    const headers = accordionElement.querySelectorAll('.accordion-header');
                    
                    contents.forEach(content => {
                        content.style.display = 'none';
                    });
                    headers.forEach(header => {
                        header.classList.remove('active');
                    });

                    // Scroll to the top of the parent section
                    const parentSection = accordionWrapper.closest('section');
                    if (parentSection) {
                        const siteHeader = document.querySelector('header');
                        let headerOffset = 0;
                        // Check if header is currently fixed (typically on larger screens)
                        if (siteHeader && getComputedStyle(siteHeader).position === 'fixed') {
                            headerOffset = siteHeader.offsetHeight;
                        }
                        const sectionTop = parentSection.offsetTop - headerOffset;
                        window.scrollTo({
                            top: sectionTop,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Sticky "Collapse All" button logic
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const controlsWrapper = aboutSection.querySelector('.accordion-with-controls');
        const collapseButton = aboutSection.querySelector('.accordion-collapse-trigger');
        const siteHeader = document.querySelector('header');

        if (controlsWrapper && collapseButton && siteHeader) {
            window.addEventListener('scroll', function() {
                const aboutSectionRect = aboutSection.getBoundingClientRect();
                const controlsWrapperRect = controlsWrapper.getBoundingClientRect(); // Current position of the wrapper
                
                // Calculate the top position for the sticky button
                // It should be below the actual header
                const headerOffsetHeight = siteHeader.offsetHeight || 0;
                const stickyTopMargin = 20; // Visual margin in px below the header
                const stickyTopValuePx = headerOffsetHeight + stickyTopMargin;

                // Condition to start sticking:
                // When the top of the controlsWrapper (where the button normally sits)
                // scrolls above the point where the button should stick.
                const shouldStartSticking = controlsWrapperRect.top < stickyTopValuePx;

                // Condition to stop sticking:
                // When the bottom of the #about section (minus button height and a small margin)
                // scrolls above the point where the button's top is fixed.
                // This means the button has reached the "end" of its allowed sticky area within #about.
                const buttonBottomStopPoint = aboutSectionRect.bottom - collapseButton.offsetHeight - stickyTopMargin;

                if (shouldStartSticking && buttonBottomStopPoint > stickyTopValuePx) {
                    // Stick the button
                    if (!collapseButton.classList.contains('collapse-trigger-sticky')) {
                        // Calculate 'right' position based on the centered controlsWrapper
                        // This calculation happens just before making it sticky, so controlsWrapper.offsetWidth is accurate.
                        const currentControlsWrapperWidth = controlsWrapper.offsetWidth;
                        const spaceToTheRightOfControlsWrapper = (window.innerWidth - currentControlsWrapperWidth) / 2;
                        const extraShiftToRightPx = 20; // จำนวน px ที่จะขยับปุ่มไปทางขวาเพิ่ม เพื่อไม่ให้บังเนื้อหา
                        
                        collapseButton.classList.add('collapse-trigger-sticky');
                        collapseButton.style.top = `${stickyTopValuePx}px`;
                        // กำหนดตำแหน่ง right โดยลดค่าลงเล็กน้อยเพื่อให้ปุ่มขยับไปทางขวาของหน้าจอมากขึ้น
                        collapseButton.style.right = `${spaceToTheRightOfControlsWrapper - extraShiftToRightPx}px`;
                    }
                } else {
                    // Unstick the button
                    collapseButton.classList.remove('collapse-trigger-sticky');
                    collapseButton.style.top = '';
                    collapseButton.style.right = '';
                }
            });
        }
    }
});