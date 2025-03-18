const noteField = document.getElementById("noteField");

// Load saved note from localStorage
const savedNote = localStorage.getItem("note");
if (savedNote) {
    noteField.innerText = savedNote;
}

// Save note to localStorage on edit
noteField.addEventListener("input", () => {
    localStorage.setItem("note", noteField.innerText);
});
