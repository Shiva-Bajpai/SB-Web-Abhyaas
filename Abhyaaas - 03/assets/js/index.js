gsap.registerPlugin(ScrollTrigger, SplitText);

let scroll;
let transitionOffset = 500;
const targetAvailable = document.querySelector('#cards-available');
let mimeCardSingleHeightImage = $('[data-mime-group] .car-card-single .card-image').innerHeight();

initPageTransitions();

function initLoaderHomeShort() {

    var tl = gsap.timeline();

    tl.set(".transition-screen", {
        autoAlpha: 0,
    });

    tl.call(function() {
        scroll.start();
        $('html').addClass('loaded');
    }, null, 0);

    tl.call(function() {}, null, 0.5);
}

// Animation - Page Home Loader
function initLoaderHome() {

    var tl = gsap.timeline();

    tl.set("html", {
        cursor: "wait"
    });

    tl.set(".loading-screen", {
        autoAlpha: 1,
    });

    tl.set(".transition-screen", {
        autoAlpha: 0,
    });

    tl.set(".loading-screen .progress-bar", {
        scaleY: 0
    });

    tl.set(".loading-screen .percentage svg", {
        yPercent: 150
    });

    tl.set(".loading-screen .number-1 .number-wrap", {
        yPercent: 100
    });

    tl.set(".loading-screen .number-ten-times .number-wrap", {
        yPercent: 10
    });

    tl.set(".transition-fade-in", {
        y: "64px",
        rotate: 0.001,
        autoAlpha: 0
    });

    tl.set(".loading-screen .loading-word > *", {
        yPercent: 100
    });

    var randomNumbers1 = gsap.utils.random([2, 3, 4]);
    var randomNumbers2 = gsap.utils.random([5, 6]);
    var randomNumbers3 = gsap.utils.random([1, 5]);
    var randomNumbers4 = gsap.utils.random([7, 8, 9]);

    var loadingSpeedNumbers = 1.2;

    tl.to(".loading-screen .progress-bar", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        scaleY: (randomNumbers1 + "" + randomNumbers3) / 100,
    });

    tl.to(".loading-screen .percentage svg", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: 0
    }, "<");

    tl.to(".loading-screen .number-2 .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: (randomNumbers1 - 1) * -10,
    }, "<");

    tl.to(".loading-screen .number-3 .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: (randomNumbers3 - 1) * -10,
    }, "<");

    tl.to(".loading-screen .loading-word-1 > *", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: 0
    }, "<");

    tl.to(".loading-screen .progress-bar", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        scaleY: (randomNumbers2 + "" + randomNumbers4) / 100,
    });

    tl.to(".loading-screen .number-2 .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: (randomNumbers2 - 1) * -10,
    }, "<");

    tl.to(".loading-screen .number-3 .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: (randomNumbers4 - 1) * -10,
    }, "<");

    tl.to(".loading-screen .loading-word-2 > *", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: 0
    }, "<");

    tl.to(".loading-screen .progress-bar", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        scaleY: 1,
    });

    tl.to(".loading-screen .number-2 .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: -90,
    }, "<");

    tl.to(".loading-screen .number-3 .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: -90,
    }, "<");

    tl.to(".loading-screen .number-1 .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: 0,
    }, "<");

    tl.to(".loading-screen .loading-word-1 > *", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: -100
    }, "<");


    tl.to(".loading-screen .number-wrap", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: -100
    });

    tl.to(".loading-screen .percentage svg", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: -300
    }, "<");

    tl.to(".loading-screen .loading-word > *", {
        duration: loadingSpeedNumbers,
        ease: "Expo.easeInOut",
        yPercent: -100
    }, "<");

    tl.set("[data-mime-group] .container .col-list", {
        y: (mimeCardSingleHeightImage * 2.5) + "px",
        rotate: 0.001,
    }, "<");

    tl.set("[data-mime-group] .container .car-cards", {
        scale: 0.5,
        y: (mimeCardSingleHeightImage / 4) + "px",
        rotate: 0.001,
    }, "<");

    tl.set("[data-mime-group] .container .car-cards .card-image-wrap.transition-image", {
        rotate: 0.001,
        scale: 1.4,
    }, "<");

    tl.set("[data-mime-group] .container .car-cards .card-info", {
        opacity: 0
    }, "<");

    tl.set("[data-mime-group] .container .car-cards .card-info.transition-info .card-info-sub", {
        yPercent: 150,
        rotate: 0.001
    }, "<");

    tl.set("[data-mime-group] .car-card-single.transition-hidden", {
        autoAlpha: 0
    }, "<");

    tl.to(".loading-screen", {
        duration: 0.1,
        ease: "ease.out",
        opacity: 0
    }, "< 0.8");

    tl.to("[data-mime-group] .container .col-list", {
        duration: 2.2,
        ease: "Power4.easeOut",
        rotate: 0.001,
        y: 0,
        clearProps: "all"
    }, "<");

    tl.to("[data-mime-group] .container .car-cards", {
        duration: 2,
        ease: "Expo.easeInOut",
        rotate: 0.001,
        scale: 1,
        y: "0px",
        clearProps: "all",
        onComplete: startHome
    }, "< 1.2");

    tl.to("[data-mime-group] .container .car-cards .card-image-wrap.transition-image", {
        duration: 2.1,
        ease: "Expo.easeInOut",
        rotate: 0.001,
        scale: 1,
        clearProps: "all",
        onStart: staggerCardInfo
    }, "<");

    tl.set("[data-mime-group] .container .car-cards .card-info", {
        opacity: 1
    }, "<");

    tl.set("[data-mime-group] .car-card-single.transition-hidden", {
        autoAlpha: 1
    }, "<");

    tl.to(".transition-fade-in", {
        duration: 1.6,
        ease: "Expo.easeOut",
        rotate: 0.001,
        stagger: 0.05,
        y: "0px",
        autoAlpha: 1,
        clearProps: "all"
    }, "< 1");

    tl.call(function() {
        scroll.stop();
        scroll.scrollTo(targetAvailable, {
            immediate: true,
            force: true,
            lock: true,
            duration: 0.0166
        });
    }, null, 0);

    tl.call(function() {
        scroll.scrollTo(targetAvailable, {
            immediate: true,
            force: true,
            lock: true,
            duration: 0.0166
        });
        scroll.update();
    }, null, 0.5);

    tl.call(function() {
        scroll.scrollTo(targetAvailable, {
            immediate: true,
            force: true,
            lock: true,
            duration: 0.0166
        });
        scroll.update();
    }, null, 1);

    function startHome() {
        scroll.scrollTo(targetAvailable, {
            immediate: true,
            force: true,
            lock: false,
            duration: 0.0166
        });
        scroll.update();
        gsap.set(".loading-screen", {
            autoAlpha: 0,
        });
        $('[data-scrolling-direction]').attr('data-scrolling-direction', 'top');
        gsap.set("html", {
            cursor: "auto",
        });
        setTimeout(function() {
            scroll.start();
        }, 100);
    }

    function staggerCardInfo() {
        $("[data-mime-group] .container .car-cards .card-info.transition-info").each(function() {
            gsap.to($(this).find(".card-info-sub"), {
                duration: 1.6,
                ease: "Expo.easeOut",
                rotate: 0.001,
                stagger: 0.05,
                yPercent: 0,
                clearProps: "all",
                delay: 1
            });
        });
        setTimeout(function() {
            $('html').addClass('loaded');
        }, 500);
    }
}

// Animation - Page Loader
function initLoader() {

    var tl = gsap.timeline();

    tl.set("html", {
        cursor: "wait"
    });

    tl.set("html", {
        cursor: "auto",
    });

    tl.to(".transition-screen", {
        duration: 0.6,
        ease: "ease.out",
        autoAlpha: 0,
        delay: 0.1
    });

    tl.call(function() {
        scroll.stop();
        $('html').addClass('loaded');
    }, null, 0)

    tl.call(function() {
        $('html').addClass('loaded');
        pageTransitionOut();
    }, null, 0.1)

}

// Animation - Page Leave
function pageTransitionIn() {
    var tl = gsap.timeline();

    if (document.querySelector('.lorem-ipsum')) {}

    tl.to(".main", {
        duration: 0.5,
        ease: "Power2.easeIn",
        y: "-64px",
    });

    if (document.querySelector('.transition-street-line-border')) {
        tl.to(".transition-street-line-border", {
            duration: 0.5,
            ease: "Expo.easeInOut",
            rotate: 0.001,
            xPercent: 0
        }, "<");
    }

    tl.to(".transition-screen", {
        duration: 0.3,
        ease: "ease.in",
        autoAlpha: 1
    }, "< 0.2");

    tl.to(".transition-screen", {
        duration: 0.6,
        ease: "ease.out",
        autoAlpha: 0,
        delay: 0.1
    });
}

// Animation - Page Enter
function pageTransitionOut() {
    var tl = gsap.timeline();

    if (document.querySelector('.fade-in-first')) {
        tl.from(".fade-in-first", {
            duration: 1.2,
            ease: "Expo.easeOut",
            rotate: 0.001,
            stagger: 0.025,
            y: "64px",
            autoAlpha: 0,
            clearProps: "all"
        }, "0.15");
    }

    if (document.querySelector('.swipe-in-first')) {
        tl.from(".swipe-in-first", {
            duration: 1.2,
            ease: "Expo.easeOut",
            rotate: 0.001,
            stagger: 0.025,
            y: "64px",
            clearProps: "all"
        }, "0.15");
    }

    if (document.querySelector('.swipe-in-first-percent')) {
        tl.from(".swipe-in-first-percent", {
            duration: 1.2,
            ease: "Expo.easeOut",
            rotate: 0.001,
            stagger: 0.025,
            yPercent: 100,
            clearProps: "all"
        }, "0.15");
    }

    if (document.querySelector('.fade-in-first-no-stagger')) {
        tl.from(".fade-in-first-no-stagger", {
            duration: 1.2,
            ease: "Expo.easeOut",
            rotate: 0.001,
            stagger: 0,
            y: "64px",
            autoAlpha: 0,
            clearProps: "all"
        }, "0.15");
    }

    if (document.querySelector('.fade-in-last')) {
        tl.from(".fade-in-last", {
            duration: 1.2,
            ease: "Expo.easeOut",
            rotate: 0.001,
            stagger: 0.025,
            y: "64px",
            autoAlpha: 0,
            clearProps: "all"
        }, "0.75");
    }

    if (document.querySelector('.swipe-in-last')) {
        tl.from(".swipe-in-last", {
            duration: 1.2,
            ease: "Expo.easeOut",
            rotate: 0.001,
            stagger: 0.025,
            y: "64px",
            clearProps: "all"
        }, "0.75");
    }

    if (document.querySelector('.default-header .street-line')) {
        tl.from(".default-header .street-line", {
            duration: 1.2,
            ease: "Expo.easeOut",
            rotate: 0.001,
            stagger: 0.2,
            xPercent: 100,
            clearProps: "all"
        }, "0.25");
    }

    tl.call(function() {
        scroll.update();
        ScrollTrigger.refresh();
    }, null, 0);

    tl.call(function() {
        scroll.update();
    }, null, 0.1);

    tl.call(function() {
        scroll.start();
    }, null, 0.11);

    tl.call(function() {
        if (document.querySelector('.section-car-single-header')) {
            gsap.set(".transition-container", {
                autoAlpha: 0,
            });

            gsap.from(".section-car-single-header .header-image-wrap", {
                duration: 1.2,
                ease: "Expo.easeOut",
                rotate: 0.001,
                y: "100vh",
                clearProps: "all",
                delay: 0
            });

            gsap.from(".section-car-single-header .header-image-wrap-inner", {
                duration: 1.2,
                ease: "Expo.easeOut",
                rotate: 0.001,
                y: "-25vh",
                clearProps: "all",
                delay: 0
            });
        }

        if (document.querySelector('.default-header-1')) {

            gsap.set(".transition-container", {
                autoAlpha: 0,
            });

            gsap.from(".default-header-1 .styled-image", {
                duration: 1.2,
                ease: "Expo.easeOut",
                rotate: 0.001,
                yPercent: 100,
                clearProps: "all",
                delay: 0
            });

            gsap.from(".default-header-1 .styled-image-inner", {
                duration: 1.2,
                ease: "Expo.easeOut",
                rotate: 0.001,
                yPercent: -75,
                clearProps: "all",
                delay: 0
            });
        }

    }, null, 0);

    tl.call(function() {
        gsap.set(".transition-container", {
            clearProps: "all"
        });
    }, null, 0.6);

}

// Reset scroll on page next
barba.hooks.leave(function() {
    history.scrollRestoration = "manual";
});

var scrollPosY = 0

barba.hooks.enter((data) => {
    if (data.trigger !== "back") {
        scrollPosY = barba.history.current.scroll.y;
    }
});

function initPageTransitions() {

    barba.hooks.leave(() => {
        initBasicFunctions();
    });

    // Functions Before
    function initResetDataBefore() {
        $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
        $('[data-filter-show-mobile]').attr('data-filter-show-mobile', 'not-active');
        $('[data-theme-body]').attr('data-theme-body', 'light');
        $('[data-theme-section]').attr('data-theme-section', 'light');
    }

    // Functions After
    function initResetDataAfter() {
        $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
        $('[data-scrolling-direction]').attr('data-scrolling-direction', 'top');
        $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
    }

    function scrollToAvailable(container) {
        const targetAvailableNext = container.querySelector('#cards-available');
        scroll.scrollTo(targetAvailableNext, {
            immediate: true,
            force: true,
            locked: true
        });
        scroll.update();
        initMimeScroll();
    }

    barba.init({
        sync: true,
        debug: false,
        timeout: 7000,
        transitions: [{
            name: 'to-home',
            from: {

            },
            to: {
                namespace: ['home']
            },
            async once(data) {
                initSmoothScroll(data.next.container);
                initScript();
                initLoaderHome(data.next.container);
            },
            async leave(data) {
                pageTransitionIn(data.current);
                initResetDataBefore();
                await delay(transitionOffset);
                initBarbaNavUpdate(data);
                initResetDataAfter();
                scroll.destroy();
                data.current.container.remove();
            },
            async enter(data) {
                pageTransitionOut(data.next);
                scrollToAvailable(data.next.container);
            },
            async beforeEnter(data) {
                ScrollTrigger.getAll().forEach(t => t.kill());
                initSmoothScroll(data.next.container);
                initScript();
            },
            async after(data) {
                if (data.trigger !== "back") {} else {
                    window.scrollTo(0, scrollPosY)
                }
            }
        }, {
            name: 'default',
            once(data) {
                initSmoothScroll(data.next.container);
                initScript();
                initLoader();
            },
            async leave(data) {
                pageTransitionIn(data.current);
                initResetDataBefore();
                await delay(transitionOffset);
                initBarbaNavUpdate(data);
                initResetDataAfter();
                scroll.destroy();
                data.current.container.remove();
            },
            async enter(data) {
                pageTransitionOut(data.next);
            },
            async beforeEnter(data) {
                ScrollTrigger.getAll().forEach(t => t.kill());
                initSmoothScroll(data.next.container);
                initScript();
            },
            async after(data) {
                if (data.trigger !== "back") {
                    window.scrollTo(0, 0);
                } else {
                    window.scrollTo(0, scrollPosY);
                };
            }
        }]
    });


    function initSmoothScroll(container) {

        // https://github.com/quentinhocde/loconative-scroll
        scroll = new LoconativeScroll({
            el: container.querySelector('[data-scroll-container]'),
            scrollToEasing: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
            smooth: true
        });

        scroll.on('scroll', ScrollTrigger.update);
        ScrollTrigger.refresh();
    }
}

// Don't touch
function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

/**
 * Fire all scripts on page load
 */
function initScript() {
    initFlickitySlider();
    initCheckWindowHeight();
    initBasicFunctions();
    initLazyLoad();
    initScrollTriggerPlayVideoInview();
    initLocoCheckScrollUpDown();
    initScrollToAnchorLoco();
    initSplitText();
    initScrollTriggerDataBackground();
    initBearlyDigitalContactForm();
    initMimeScroll();
    initMarqueeScroll();
    initScrolltriggerAnimations();
}

/**
 * Barba Update Links outside Main on page Transition
 */
function initBarbaNavUpdate(data) {

    const updateItems = $(data.next.html).find('[data-barba-update]');

    $('[data-barba-update]').each(function(index) {
        if ($(updateItems[index]).get(0)) {
            const newLinkStatus = $(updateItems[index]).get(0).getAttribute('data-link-status');
            $(this).attr('data-link-status', newLinkStatus);
        }
    });
}

/**
 * Window Inner Height Check
 */
function initCheckWindowHeight() {
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Basic Functions
 */
function initBasicFunctions() {

    // Toggle Navigation
    $('[data-navigation-toggle="toggle"]').click(function() {
        if ($('[data-navigation-status]').attr('data-navigation-status') == 'not-active') {
            $('[data-navigation-status]').attr('data-navigation-status', 'active');
        } else {
            $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
        }
    });

    // Close Navigation
    $('[data-navigation-toggle="close"]').click(function() {
        $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
    });

    // Key ESC - Close Navigation
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            if ($('[data-navigation-status]').attr('data-navigation-status') == 'active') {
                $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
            }
        }
    });

    // Filter Show All
    $('[data-filter-toggle="show-all"]').click(function() {
        if ($('[data-filter-show-all]').attr('data-filter-show-all') == 'not-active') {
            $('[data-filter-show-all]').attr('data-filter-show-all', 'active');
        } else {
            $('[data-filter-show-all]').attr('data-filter-show-all', 'not-active');
        }
    });

    // Filter Show Mobile
    $('[data-filter-toggle="show-mobile"]').click(function() {
        if ($('[data-filter-show-mobile]').attr('data-filter-show-mobile') == 'not-active') {
            $('[data-filter-show-mobile]').attr('data-filter-show-mobile', 'active');
        } else {
            $('[data-filter-show-mobile]').attr('data-filter-show-mobile', 'not-active');
        }
    });

    // Show Car Single Specs/Options
    $(".section-car-single-details").each(function() {
        var tableGroup = $(this);
        tableGroup.find('.table-switcher[data-table-id]').click(function() {
            var tableID = $(this).attr('data-table-id');
            if ($(this).attr('data-table-status') == 'not-active') {
                tableGroup.find('[data-table-id="' + tableID + '"]').attr('data-table-status', 'active').siblings().attr('data-table-status', 'not-active');
            }
        });
    });

    // Show Inquire Form Filters
    $(".section-inquire-forms").each(function() {
        var filterGroup = $(this);
        filterGroup.find('.single-filter[data-filter-slug]').click(function() {
            var filterSlug = $(this).attr('data-filter-slug');
            if ($(this).attr('data-filter-status') == 'not-active') {
                filterGroup.find('.row-forms').addClass('transition-out');
                setTimeout(function() {
                    filterGroup.find('.row-forms').addClass('transition-in').removeClass('transition-out');
                    filterGroup.find('[data-filter-slug="' + filterSlug + '"]').attr('data-filter-status', 'active').siblings().attr('data-filter-status', 'not-active');
                }, 200);
                setTimeout(function() {
                    filterGroup.find('.row-forms').removeClass('transition-in');
                }, 600);
            }
        });
    });
}

/**
 * Lazy Load
 */
function initLazyLoad() {
    // https://github.com/verlok/vanilla-lazyload
    var lazyLoadInstance = new LazyLoad({
        container: document.querySelector('[data-scroll-container]'),
        elements_selector: ".lazy",
    });
}

/**
 * Play Video Inview
 */
function initScrollTriggerPlayVideoInview() {

    let allVideoDivs = gsap.utils.toArray('.playpauze');

    allVideoDivs.forEach((videoDiv, i) => {

        let videoElem = videoDiv.querySelector('video')

        ScrollTrigger.create({
            trigger: videoElem,
            start: '0% 120%',
            end: '100% -20%',
            onEnter: () => videoElem.play(),
            onEnterBack: () => videoElem.play(),
            onLeave: () => videoElem.pause(),
            onLeaveBack: () => videoElem.pause(),
        });
    });
}

/**
 * Lenis - Check Scroll up or Down
 */

function initLocoCheckScrollUpDown() {

    var lastScrollTop = 0
    var threshold = 50;
    var thresholdTop = 50;

    function startCheckScroll() {
        scroll.on('scroll', (instance) => {
            var nowScrollTop = instance.scroll.y;

            if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {

                // Check Scroll Direction
                if (nowScrollTop > lastScrollTop) {
                    $("[data-scrolling-direction]").attr('data-scrolling-direction', 'down');
                } else {
                    $("[data-scrolling-direction]").attr('data-scrolling-direction', 'up');
                }
                lastScrollTop = nowScrollTop;

                // Check if Scroll Started
                if (nowScrollTop > thresholdTop) {
                    $("[data-scrolling-started]").attr('data-scrolling-started', 'true');
                } else {
                    $("[data-scrolling-started]").attr('data-scrolling-started', 'false');
                }
            }
        });
    }
    startCheckScroll();

    // Reset instance
    barba.hooks.after(() => {
        startCheckScroll();
    });
}

/**
 * Locomotive - ScrollTo Anchor Links
 */
function initScrollToAnchorLoco() {

    $("[data-anchor-target]").click(function() {

        let targetScrollToAnchorLoco = $(this).attr('data-anchor-target');
        scroll.scrollTo(targetScrollToAnchorLoco, {
            duration: 1.5
        });
    });
}

/**
 * GSAP Split Text
 */
function initSplitText() {

    var splitChars = new SplitText(".split-chars", {
        type: "chars",
        charsClass: "single-char"
    });

    $(splitChars.elements).each(function() {
        if ($(this).hasClass('is-split')) {

        } else {
            $(this).find('.single-char').each(function(index) {
                index = (index / 100) + 's';
                $(this).css('--delay', index);
            });
            $(this).addClass('is-split');
        }
    });
}

/**
 * Scrolltrigger - Check Theme of Sections
 */
function initScrollTriggerDataBackground() {

    if (document.querySelector('[data-card-status="sold"]')) {
        $('[data-card-status="sold"]').each(function() {
            let triggerElement = $(this);
            let targetElement = $('[data-theme-body]');

            ScrollTrigger.create({
                trigger: triggerElement,
                start: "0% center",
                end: "100% center",
                markers: false,
                toggleActions: 'play reverse play reset',
                onEnter: () => targetElement.attr('data-theme-body', 'dark'),
                onEnterBack: () => targetElement.attr('data-theme-body', 'dark'),
                onLeave: () => targetElement.attr('data-theme-body', 'light'),
                onLeaveBack: () => targetElement.attr('data-theme-body', 'light'),
            });
        });
    }

    if (document.querySelector('[data-theme-section="dark"]')) {
        $('[data-theme-section="dark"]').each(function() {
            let triggerElement = $(this);
            let targetElement = $('[data-theme-section]');

            ScrollTrigger.create({
                trigger: triggerElement,
                start: "0% 38px",
                end: "100% 38px",
                markers: false,
                toggleActions: 'play reverse play reset',
                onEnter: () => targetElement.attr('data-theme-section', 'dark'),
                onEnterBack: () => targetElement.attr('data-theme-section', 'dark'),
                onLeave: () => targetElement.attr('data-theme-section', 'light'),
                onLeaveBack: () => targetElement.attr('data-theme-section', 'light'),
            });
        });
    }
}

/**
 * Plugin Custom Contact Form Bearly Digital
 */
function initBearlyDigitalContactForm() {
    window.bearly.loadforms();
}

/**
 * Mime Scroll
 */
function initMimeScroll() {

    if ($(window).width() >= 1025) {


        $('[data-mime-group]').each(function() {

            let mimeGroup = $(this);
            let mimeScroll, mimeScrollWrapperHeight, mimeScrollCardsHeight, mimeScrollCardSingleHeight, mimeContentCardSingleHeightImage, mimeContentCardSingleHeightInfo;

            function calculateMime() {
                mimeScroll = mimeGroup.find('[data-mime-scroll]');
                mimeScrollWrapperHeight = mimeGroup.find('.mime-scroll-wrapper').innerHeight();
                mimeScrollCardsHeight = mimeGroup.find('.mime-scroll-cards').innerHeight();
                mimeScrollCardSingleHeight = mimeGroup.find('.mime-scroll-cards .mime-card').innerHeight();
                mimeContentWrapperHeight = mimeGroup.find('.container .row').innerHeight();
                mimeContentCardSingleHeightImage = mimeGroup.find('.car-card-single .card-image').innerHeight();
                mimeContentCardSingleHeightInfo = mimeGroup.find('.car-card-single .card-info').innerHeight();
                mimeGroup.css('--set-padding-top', (mimeScroll.innerHeight() / 2) - (mimeContentCardSingleHeightImage / 2) + 'px');
                mimeGroup.css('--set-padding-bottom', (mimeScroll.innerHeight() / 2) - (mimeContentCardSingleHeightImage / 2) - mimeContentCardSingleHeightInfo + 'px');
                mimeGroup.next().css('--set-padding-top', (mimeScroll.innerHeight() / 2) - (mimeContentCardSingleHeightImage / 2) + 'px');
                mimeGroup.next().css('--set-padding-bottom', (mimeScroll.innerHeight() / 2) - (mimeContentCardSingleHeightImage / 2) - mimeContentCardSingleHeightInfo + 'px');
            }


            // Start Calculate
            calculateMime();

            function updateScrollTrigger() {
                let tl = gsap.timeline({
                    scrollTrigger: {
                        id: "mimeTrigger",
                        trigger: mimeGroup,
                        start: (mimeScroll.innerHeight() / 2) + ' center',
                        end: (mimeGroup.innerHeight() - (mimeScroll.innerHeight() / 2)) + ' center',
                        scrub: 0.1,
                        markers: false,
                        invalidateOnRefresh: true
                    }
                });

                tl.fromTo(mimeGroup.find('.mime-scroll-cards'), {
                    y: (mimeScrollWrapperHeight / 2) - (mimeScrollCardSingleHeight / 2),
                }, {
                    y: ((mimeScrollCardsHeight - (mimeScrollWrapperHeight / 2) - (mimeScrollCardSingleHeight / 2)) * -1),
                    ease: "none"
                });
            }

            // Start Scrolltrigger
            updateScrollTrigger();

            // Reset Calculate + ScrollTrigger after resize
            $(window).resize(function() {
                clearTimeout(window.resizedFinished);
                window.resizedFinished = setTimeout(function() {
                    ScrollTrigger.getById("mimeTrigger").kill();
                    calculateMime();
                    updateScrollTrigger();
                    scroll.update();
                }, 250);
            });

        });
    }
}

/**
 * Marquee on Scroll Direction
 */
function initMarqueeScroll() {

    $('[data-marquee-target]').each(function() {

        let marquee = $(this);

        let marqueeItemsWidth = marquee.find(".marquee-content").width();
        let marqueeSpeed = marquee.attr('data-marquee-speed') * (marqueeItemsWidth / $(window).width());

        // Speed up Marquee on Tablet & Mobile
        if ($(window).width() <= 540) {
            marqueeSpeed = marqueeSpeed * 0.33;
        } else if ($(window).width() <= 1024) {
            marqueeSpeed = marqueeSpeed * 0.66;
        }

        let marqueeContent = gsap.to(marquee.find('.marquee-content'), {
            xPercent: -100,
            repeat: -1,
            duration: marqueeSpeed,
            ease: "linear",
            paused: true
        }).totalProgress(0.5);
        gsap.set(marquee.find(".marquee-content"), {
            xPercent: 50
        });

        ScrollTrigger.create({
            trigger: marquee,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => marqueeContent.play(),
            onEnterBack: () => marqueeContent.play(),
            onLeave: () => marqueeContent.pause(),
            onLeaveBack: () => marqueeContent.pause()
        });
    });
}

/**
 * Flickity Slider
 */
function initFlickitySlider() {

    // Source
    // https://flickity.metafizzy.co/

    // Slider type: Cards

    $('[data-flickity-slider-type]').each(function(index) {

        var sliderIndexID = 'flickity-slider-id-' + index;
        $(this).attr('id', sliderIndexID);

        var sliderThis = $(this);

        var flickitySliderGroup = document.querySelector('#' + sliderIndexID + ' .flickity-carousel');
        var flickitySlider = sliderThis.find('.flickity-carousel').flickity({
            // options
            watchCSS: true,
            contain: true,
            wrapAround: false,
            dragThreshold: 10,
            prevNextButtons: false,
            pageDots: false,
            cellAlign: 'left',
            selectedAttraction: 0.015,
            friction: 0.25,
            percentPosition: true,
            freeScroll: false,
            on: {
                'dragStart': () => {
                    flickitySlider.closest('a.car-filtered-card-single').css("pointer-events", "none");
                },
                'dragEnd': () => {
                    flickitySlider.closest('a.car-filtered-card-single').css("pointer-events", "auto");
                },
            }
        });

        // Flickity instance
        var flkty = flickitySlider.data('flickity');

        flickitySlider.on('change.flickity', function(event, index) {
            var number = String("0" + (index + 1)).slice(-2);
            sliderThis.closest('.section-car-single-slider').find('[data-flickity-active-slide-progress]').text(number);
        });
    });

}

/**
 * Scrolltrigger Animations Desktop + Mobile
 */
function initScrolltriggerAnimations() {

    // if(document.querySelector('.has-scroll-smooth #footer')) {
    //   // Scrolltrigger Animation : Example
    //   $('.has-scroll-smooth #footer').each(function (index) {
    //     let triggerElement = $(this);
    //     let targetElement = $(this).find('.footer-inner');

    //     let tl = gsap.timeline({
    //       scrollTrigger: {
    //         trigger: triggerElement,
    //         start: "0% 100%",
    //         end: "100% 100%",
    //         scrub: 0
    //       }
    //     });

    //     tl.from(targetElement, {
    //       yPercent: -33,
    //       ease: "none"
    //     });
    //   });
    // }
}