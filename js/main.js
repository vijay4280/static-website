(function () {

  const searchData = [
    { label: "Home", url: "index.html" },
    { label: "Drip Irrigation", url: "dripirri.html" },
    { label: "Sprinkler Irrigation", url: "sprinkler.html" },
    { label: "Sprinkler", url: "sprinkler.html" },
    { label: "Rain Sprinkler", url: "rainsprinkler.html" },
    { label: "Landscape Irrigation", url: "landscape.html" },
    { label: "Economical Irrigation", url: "economical.html" },
    { label: "About Us", url: "about.html" },
    { label: "Founder", url: "team.html" },
    { label: "History", url: "team.html" },
    { label: "Leadership", url: "testimonial.html" },
    { label: "Sustainabilty", url: "404.html" },
    { label: "Blog", url: "blog.html" },
    { label: "Contact Us", url: "contact.html" },
    { label: "Products", url: "products.html" },

    { label: "Rain Silver Sprinkler", url: "rain-silver.html" },
    { label: "Rain Gold Sprinkler", url: "rainsprinkler.html" },
    { label: "Rain Violet Sprinkler", url: "rainsprinkler.html" },
    { label: "Rain Diamond Sprinkler", url: "rainsprinkler.html" },
  ];

  function highlightMatch(text, keyword) {
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, "<strong>$1</strong>");
  }

  function setupSearchBar() {
    let input = document.getElementById("searchInput");
    let suggestions = document.getElementById("searchSuggestions");
    if (!input || !suggestions) return;

    input.addEventListener("input", function () {
      const val = this.value.trim().toLowerCase();
      suggestions.innerHTML = "";

      if (!val) {
        suggestions.style.display = "none";
        return;
      }

      let matches = searchData.filter(item =>
        item.label.toLowerCase().includes(val)
      );

      // Sort so most relevant items come first
      matches.sort((a, b) =>
        a.label.toLowerCase().indexOf(val) - b.label.toLowerCase().indexOf(val)
      );

      if (matches.length === 0) {
        const li = document.createElement("li");
        li.innerHTML = "No Result Found";
        li.style.cursor = "default";
        suggestions.appendChild(li);
        suggestions.style.display = "block";
        return;
      }

      matches.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = highlightMatch(item.label, val);

        li.addEventListener("mousedown", () => {
          window.location.href = item.url;
        });

        suggestions.appendChild(li);
      });

      suggestions.style.display = "block";
    });

    document.addEventListener("click", function (e) {
      if (!suggestions.contains(e.target) && e.target !== input) {
        suggestions.style.display = "none";
      }
    });

    input.addEventListener("focus", function () {
      if (suggestions.children.length) suggestions.style.display = "block";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSearchBar);
  } else {
    setupSearchBar();
  }

})();
(function ($) {
  "use strict"; 

  
  // for header and footer
  function loadHTML(id, url) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById(id).innerHTML = data;
      });
  }

  loadHTML("footer-container", "footer.html");
  loadHTML("header-container", "header.html");
  

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500, "easeInOutExpo");
    return false;
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Portfolio isotope and filter
  var portfolioIsotope = $(".portfolio-container").isotope({
    itemSelector: ".portfolio-item",
    layoutMode: "fitRows",
  });
  $("#portfolio-flters li").on("click", function () {
    $("#portfolio-flters li").removeClass("active");
    $(this).addClass("active");

    portfolioIsotope.isotope({ filter: $(this).data("filter") });
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    items: 1,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  });
})(jQuery);

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());
  const responseMessage = document.getElementById('responseMessage');

  try {
    const res = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.text();
    responseMessage.innerText = result;
    responseMessage.classList.add('text-success');
    this.reset();
  } catch (err) {
    responseMessage.innerText = 'Something went wrong. Please try again later.';
    responseMessage.classList.add('text-danger');
  }
});


// Newsletter Form Script
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newsletterForm");

    if (!form) return; // Prevent errors if section doesn't exist on other pages

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("newsletterName").value.trim();
        let email = document.getElementById("newsletterEmail").value.trim();
        let messageBox = document.getElementById("newsletterMessage");

        if (name === "" || email === "") {
            messageBox.innerHTML = "<span class='text-danger'>Please fill all fields!</span>";
            return;
        }

        // Show Success Message
        messageBox.innerHTML = `<span class='text-success'>Thank you for subscribing, ${name}!</span>`;

        // Reset Form after successful submission
        form.reset();
    });
});


  const mobileSearchBtn = document.getElementById("mobileSearchBtn");
  const mobileSearchBar = document.getElementById("mobileSearchBar");

  mobileSearchBtn.addEventListener("click", () => {
    mobileSearchBar.classList.toggle("active");
  });
