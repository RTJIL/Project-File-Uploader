function edit(button) {
  const dropDown = button.closest(".dropdown").querySelector(".dropdown-menu");
  dropDown.classList.add("hidden");

  const dropDownIco = button
    .closest(".dropdown")
    .querySelector(".drop-ico-wrapper");
  dropDownIco.classList.add("hidden");

  const folderElement = button.closest(".folder");
  const titleField = folderElement.querySelector(".folder-title");
  const folderTitle = titleField.dataset.title;
  const folderId = titleField.dataset.id;

  const formContainer = folderElement.querySelector(".edit-form-container");
  const existingForm = titleField.querySelector("form");

  
  if (existingForm) {
    existingForm.remove();
    
    titleField.textContent = titleField.dataset.title;
    
    return;
  }
  
  const form = document.createElement("form");
  form.action = `/edit/${folderId}`;
  form.method = "POST";
  
  const label = document.createElement("label");
  label.htmlFor = "edit";
  
  const input = document.createElement("input");
  input.type = "text";
  input.id = "edit";
  input.name = "edit";
  input.value = folderTitle;
  
  const save = document.createElement("button");
  save.type = "submit";
  save.innerText = "Save";
  
  titleField.classList.add("hidden");
  
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.innerText = "Cancel";
  cancel.addEventListener("click", (e) => {
    e.preventDefault();
    form.remove();
    titleField.classList.remove("hidden");
    dropDownIco.classList.remove("hidden");
  });
  
  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("form-buttons");
  
  buttonGroup.appendChild(save);
  buttonGroup.appendChild(cancel);
  
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(buttonGroup);
  

  formContainer.innerHTML = "";
  formContainer.appendChild(form);
}
