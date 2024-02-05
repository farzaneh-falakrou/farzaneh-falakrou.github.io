document.addEventListener('click', function (event) {
  if (event.target.classList.contains('zoomable-image')) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      event.target.requestFullscreen();
    }
  }
});