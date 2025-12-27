
const countryPageMap = {
    "United Arab Emirates": "uae.html",
    "Australia": "australia.html",
    "Burundi": "burundi.html",
    "Bangladesh": "bangladesh.html",
    "Bahrain": "bahrain.html",
    "Bolivia": "bolivia.html",
    "Brazil": "brazil.html",
    "Bhutan": "bhutan.html",
    "Botswana": "botswana.html",
    "Chile": "chile.html",
    "Côte d'Ivoire": "cote-divoire.html",
    "Cameroon": "cameroon.html",
    "Egypt": "egypt.html",
    "Ethiopia": "ethiopia.html",
    "Gabon": "gabon.html",
    "Georgia": "georgia.html",
    "Ghana": "ghana.html",
    "Guinea": "guinea.html",
    "Guadeloupe": "guadeloupe.html",
    "The Gambia": "gambia.html",
    "Guatemala": "guatemala.html",
    "Indonesia": "indonesia.html",
    "Iran": "iran.html",
    "Iraq": "iraq.html",
    "Kenya": "kenya.html",
    "Kuwait": "kuwait.html",
    "Lebanon": "lebanon.html",
    "Sri Lanka": "sri-lanka.html",
    "Morocco": "morocco.html",
    "Maldives": "maldives.html",
    "Mexico": "mexico.html",
    "Myanmar": "myanmar.html",
    "Mongolia": "mongolia.html",
    "Mozambique": "mozambique.html",
    "Malawi": "malawi.html",
    "Namibia": "namibia.html",
    "Niger": "niger.html",
    "Nigeria": "nigeria.html",
    "Netherlands": "netherlands.html",
    "Nepal": "nepal.html",
    "New Zealand": "new-zealand.html",
    "Oman": "oman.html",
    "Peru": "peru.html",
    "Philippines": "philippines.html",
    "Qatar": "qatar.html",
    "Rwanda": "rwanda.html",
    "Sudan": "sudan.html",
    "Saudi Arabia": "saudi-arabia.html",
    "South Africa": "south-africa.html",
    "Senegal": "senegal.html",
    "Somalia": "somalia.html",
    "Seychelles": "seychelles.html",
    "Thailand": "thailand.html",
    "Tanzania": "tanzania.html",
    "Uganda": "uganda.html",
    "United States": "united-states.html",
    "Vietnam": "viet-nam.html",
    "Yemen": "yemen.html",
    "Zambia": "zambia.html",
    "Zimbabwe": "zimbabwe.html"
};

// --- Keep India permanently golden ---
window.addEventListener("DOMContentLoaded", () => {
    const india = document.getElementById("India");
    if (india) {
        india.style.fill = "#FFD700"; // golden color
        india.setAttribute("data-highlighted", "true");
        india.setAttribute("data-locked", "false"); // lock India's color
    }
});

// --- Stop hover/leave/click from changing India's color ---
document.addEventListener("mouseover", e => {
    if (e.target.id === "India") e.target.style.fill = "#FFD700";
});
document.addEventListener("mouseleave", e => {
    if (e.target.id === "India") e.target.style.fill = "#FFD700";
});
document.addEventListener("click", e => {
    if (e.target.id === "India") e.target.style.fill = "#FFD700";
});

// --- Keep India golden even after reset ---
document.getElementById('map-reset')?.addEventListener('click', () => {
    const india = document.getElementById("India");
    if (india) {
        india.style.fill = "#FFD700";
        india.setAttribute("data-highlighted", "false");
        india.setAttribute("data-locked", "false");
    }
});


const HIGHLIGHT_COLOR = "#90EE90"; // light green
const CLICK_COLOR = "#007BFF";     // blue on click

// Highlight all countries in the map list
function highlightAllCountries() {
    Object.keys(countryPageMap).forEach(country => {
        const element = document.getElementById(country);
        if (element) {
            element.style.fill = HIGHLIGHT_COLOR;
            element.setAttribute("data-highlighted", "true");
        }
    });
}

// Tooltip setup
function setupTooltip(e) {
    window.onmousemove = function (j) {
        const x = j.clientX, y = j.clientY;
        document.getElementById('name').style.top = (y - 100) + 'px';
        document.getElementById('name').style.left = (x - 1) + 'px';
    };
    document.getElementById("name").style.opacity = 1;
    document.getElementById("namep").innerText = e.id;
}

function hideTooltip() {
    document.getElementById("name").style.opacity = 0;
}

// Handle country click
function handleCountryClick(place) {
    document.querySelectorAll(".allPaths").forEach(p => {
        if (p.getAttribute("data-highlighted") === "true") {
            p.style.fill = HIGHLIGHT_COLOR;
        } else {
            p.style.fill = "#ececec";
        }
    });

    // make clicked country blue
    const clicked = document.getElementById(place);
    if (clicked) clicked.style.fill = CLICK_COLOR;

    // open country page in same tab
    const filename = countryPageMap[place];
    if (filename) window.location.href = filename;
}

// Main: runs after SVG loads
window.addEventListener("DOMContentLoaded", () => {
    highlightAllCountries();

    document.querySelectorAll(".allPaths").forEach(e => {
        e.setAttribute('class', `allPaths ${e.id}`);

        // Hover effect
        e.addEventListener("mouseover", function () {
            const classes = e.className.baseVal.replace(/ /g, '.');
            document.querySelectorAll(`.${classes}`).forEach(c => {
                if (c.getAttribute("data-highlighted") !== "true") c.style.fill = "pink";
            });
            setupTooltip(e);
        });

        // Mouse leave
        e.addEventListener("mouseleave", function () {
            const classes = e.className.baseVal.replace(/ /g, '.');
            document.querySelectorAll(`.${classes}`).forEach(c => {
                if (c.getAttribute("data-highlighted") === "true") {
                    c.style.fill = HIGHLIGHT_COLOR;
                } else {
                    c.style.fill = "#ececec";
                }
            });
            hideTooltip();
        });

        // Click event
        e.addEventListener("click", function () {
            handleCountryClick(e.id);
        });
    });
});
const mv = document.getElementById("Maldives");
const bbox = mv.getBBox();     // get exact position + size

const scale = 8;               // how much you want to enlarge
const cx = bbox.x + bbox.width / 2;
const cy = bbox.y + bbox.height / 2;

// apply transformation around center
mv.setAttribute(
  "transform",
  `translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`
);



