function del(e) {
    //! This function is attached to onclick on a button
    fetch(e.value, { method: "DELETE" })
        .then((res) => {
            //! Makes a redirect DELETE request where
            //! a GET is expected
            console.info(res);
        })
        .catch((e) => console.info(e));
}

function patch(e) {
    fetch(e.target.value, { method: "PATCH" });
}
function post(e) {
    e.preventDefault();
    console.dir(e);
    return;
}
function get(e) {
    fetch(e.target.value, { method: "DELETE" });
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
//         fetch("/campgrounds", {
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
