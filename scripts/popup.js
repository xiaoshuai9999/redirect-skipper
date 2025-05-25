document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs[0]) {
      const url = tabs[0].url;
      document.getElementById("current-url").textContent = url;
    } else {
      document.getElementById("current-url").textContent = "Unable to get URL";
    }
  });
});
