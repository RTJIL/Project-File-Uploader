function toggleDropdown(wrapperEl) {
  const dropdown = wrapperEl.nextElementSibling;
  dropdown.classList.toggle("hidden");
}

// Optional: Close all open dropdowns if clicked outside
window.addEventListener("click", (e) => {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (!menu.parentElement.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });
});
