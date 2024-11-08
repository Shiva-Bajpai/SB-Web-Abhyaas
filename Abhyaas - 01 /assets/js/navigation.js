	// Open/close navigation when clicked .nav-icon
	$(document).ready(function() {
	    $('.nav-icon').click(function() {
	        $('.nav-icon').toggleClass('active');
	        $("nav").toggleClass('active');
	        $("main").toggleClass('active');
	    });
	    $('.black-overlay').click(function() {
	        $('.nav-icon').removeClass('active');
	        $("nav").removeClass('active');
	        $("main").removeClass('active');
	    });

	});


	//Check to see if the window is top if not then display button
	$(window).scroll(function() {
	    if ($(this).scrollTop() > 500) {
	        $('main').addClass('scrolled');
	    } else {
	        $('main').removeClass('scrolled');
	    }
	});

	$(document).ready(function() {
	    window.addEventListener("pageshow", function(event) {
	        var historyTraversal = event.persisted ||
	            (typeof window.performance != "undefined" &&
	                window.performance.navigation.type === 2);
	        if (historyTraversal) {
	            // Handle page restore.
	            window.location.reload();
	        }
	    });
	});

	$(document).ready(function() {
	    $("body").addClass("loaded");
	});


	$(document).ready(function() {
	    $('.overlay-transition').fadeOut(250);
	    $(".animatelink").click(function(e) {
	        e.preventDefault();
	        $link = $(this).attr("href");
	        $(".overlay-transition").hide().fadeIn(250, function() {
	            window.location = $link;
	        });
	    });

	});

	$(document).ready(function() {
	    $('.photoswipe-wrapper').masonry({
	        itemSelector: '.photoswipe-item',
	        columnWidth: 0
	    });
	});