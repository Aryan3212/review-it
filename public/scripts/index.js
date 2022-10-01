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
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button'
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

//! This does an AJAX POST request
//! and does an additional GET redirect request
//! this differs from the DELETE request which prompts
//! another DELETE redirect
// document.addEventListener("DOMContentLoaded", () => {
//     const f = document.querySelector("form");
//     f.addEventListener("submit", (e) => {
//         e.preventDefault();
//         console.dir(e.target);
//         const data = JSON.stringify({
//             title: "title",
//             price: 99,
//             description: "Description",
//             location: {
//                 geometry: { coordinates: [1, 1] },
//                 properties: { name: "name" },
//             },
//         });
//         console.log(data);
//         fetch("/posts", {
//             method: "POST",
//             redirect: "follow",
//             headers: {
//                 "Content-type": "application/json",
//             },
//             body: data,
//         })
//             .then((res) => {
//                 console.log(res);
//                 window.location.href = r.url;
//             })
//             .catch((e) => {
//                 console.log("Catch", e);
//             });
//     });
// });
