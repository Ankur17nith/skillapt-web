// Sets data-theme before first paint to avoid a flash. Kept as an external
// file so the Content-Security-Policy can use script-src 'self' (no inline).
(function () {
  try {
    var saved = localStorage.getItem("skillapt-theme") || localStorage.getItem("skillpm-theme");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (systemDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
