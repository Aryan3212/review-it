new Glide('.glide', {
  type: 'slider',
  perView: 1,
  focusAt: 'center',
  breakpoints: {
    800: {
      perView: 1
    },
    480: {
      perView: 1
    }
  }
}).mount();
