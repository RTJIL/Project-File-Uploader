// /public/js/preventInstall.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const fileInput = document.getElementById("file");
  const fileNameDisplay = document.getElementById("fileName");
  const submitBtn = form.querySelector(".submit-btn");
  const dropArea = document.querySelector(".input-label");

  // Disable button initially
  submitBtn.disabled = true;

  // Highlight on drag
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
  });

  // Handle drop
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const dt = new DataTransfer();
      dt.items.add(files[0]); // only allow one
      fileInput.files = dt.files;

      fileNameDisplay.textContent = files[0].name;
      submitBtn.disabled = false;
    }
  });

  // Disable manual file picker
  fileInput.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Please use drag & drop to upload the file.");
  });

  fileInput.addEventListener("change", () => {
    // Prevent selection from enabling submit
    fileInput.value = "";
    fileNameDisplay.textContent = "Upload file";
    submitBtn.disabled = true;
  });
});
