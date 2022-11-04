document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(
        ($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);

            $trigger.addEventListener('click', () => {
                openModal($target);
            });
        }
    );

    // Add a click event on various child elements to close the parent modal
    (
        document.querySelectorAll(
            '.modal-background, .modal-close,.modal-alternate-action, .modal-card-head .delete, .modal-card-foot .button'
        ) || []
    ).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.key === 27) {
            // Escape key
            closeAllModals();
        }
    });
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll('.navbar-burger'),
        0
    );

    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
        el.addEventListener('click', () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
        });
    });
    // Select the button
    (function () {
        const btn = document.querySelector('#dark-mode-icon');
        // Select the stylesheet <link>
        const theme = document.querySelector('#dark-theme-link');
        function setLightTheme() {
            theme.href = '';
            btn.firstChild.classList.remove('fa-sun');
            btn.firstChild.classList.add('fa-moon');
        }
        function setDarkTheme() {
            theme.href = '/public/styles/dark-mode.css';
            btn.firstChild.classList.remove('fa-moon');
            btn.firstChild.classList.add('fa-sun');
        }
        if (window.matchMedia) {
            window
                .matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', (event) => {
                    event.matches ? setDarkTheme() : setLightTheme();
                });
            // window.matchMedia('(prefers-color-scheme: dark)').emit('change');
            window.matchMedia('(prefers-color-scheme: dark)')
                ? setDarkTheme()
                : setLightTheme;
        } else {
            setLightTheme();
        }
        btn.addEventListener('click', function () {
            theme.getAttribute('href') === '/public/styles/dark-mode.css'
                ? setLightTheme()
                : setDarkTheme();
        });
    })();
    (function () {
        const flashMessageBox = document.querySelector('.flash-messages');
        flashMessageBox.addEventListener('animationend', () => {
            flashMessageBox.style.display = 'none';
        });
    })();
});

function del(e) {
    //! This function is attached to onclick on a button
    fetch(e.value, { method: 'DELETE' })
        .then((res) => {
            //! Makes a redirect DELETE request where
            //! a GET is expected
            console.info(res);
        })
        .catch((e) => console.info(e));
}

function patch(e) {
    fetch(e.target.value, { method: 'PATCH' });
}
function post(e) {
    e.preventDefault();
    console.dir(e);
}
function get(e) {
    fetch(e.target.value, { method: 'DELETE' });
}

function setLongLatOnForm(lng, lat, form) {
    form.longitude.value = lng;
    form.latitude.value = lat;
    fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${mapTilerApiKey}`
    )
        .then((raw) => {
            return raw.json();
        })
        .then((data) => {
            form.name.value = data.features && data.features[0].place_name;
        })
        .catch(() => {});
}

function openAdjacentForm(e) {
    e.style.display = 'none';
    e.nextSibling.style.display = 'block';
    e.parentElement.nextSibling.style.display = 'block';
    e.parentElement.nextSibling.scrollIntoView();
}
function closeAdjacentForm(e) {
    e.style.display = 'none';
    e.previousSibling.style.display = 'block';
    e.parentElement.nextSibling.style.display = 'none';
}
