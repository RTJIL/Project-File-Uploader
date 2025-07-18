document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const fileInput = document.getElementById("file");
  const fileNameDisplay = document.getElementById("fileName");
  const submitBtn = form.querySelector(".submit-btn");
  const dropArea = document.querySelector(".input-label");

  submitBtn.disabled = true; 

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const dt = new DataTransfer();
      dt.items.add(files[0]); 
      fileInput.files = dt.files;

      fileNameDisplay.textContent = files[0].name;
      submitBtn.disabled = false;
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
      submitBtn.disabled = false;
    } else {
      fileNameDisplay.textContent = "Upload file";
      submitBtn.disabled = true;
    }
  });


  form.addEventListener("submit", (e) => {
    if (!fileInput.files.length) {
      e.preventDefault();
      alert("You gotta upload a file first, either drag & drop or pick manually.");
    }
  });
});
