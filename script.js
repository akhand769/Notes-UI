// DOM elements
const saveButton = document.querySelector("#btnSave");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const notesContainer = document.querySelector("#notes_container");
const btnDelete = document.querySelector("#btnDelete");
const btnUpdate = document.querySelector("#btnUpdate");

// Initialize by loading notes
getAllNotes();

// Clear form inputs
function clearForm() {
  titleInput.value = "";
  descriptionInput.value = "";
}

// Add a new note
function addNote(title, description) {
  const noteData = {
    title: title,
    description: description,
    isVisible: true,
  };

  fetch("https://localhost:7260/api/Notes", {
    method: "POST",
    body: JSON.stringify(noteData),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log the server response
      clearForm();
      getAllNotes();
    });
}

// Retrieve all notes from the server
function getAllNotes() {
  btnDelete.style.display = "none";
  saveButton.style.display = "inline";
  btnUpdate.style.display = "none";

  fetch("https://localhost:7260/api/Notes")
    .then((response) => response.json())
    .then((data) => displayNotes(data));
}

// Display notes in the UI
function displayNotes(notes) {
  let allNotesHTML = "";

  notes.forEach((note) => {
    const noteHTML = `
      <div class="note" data-id="${note.id}">
        <h3>${note.title}</h3>
        <p>${note.description}</p>
      </div>`;

    allNotesHTML += noteHTML;
  });

  notesContainer.innerHTML = allNotesHTML;

  // Add click event listeners to each note
  const noteElements = document.querySelectorAll(".note");
  noteElements.forEach((noteElement) => {
    noteElement.addEventListener("click", function () {
      btnDelete.style.display = "inline";
      saveButton.style.display = "none";
      btnUpdate.style.display = "inline";

      const noteId = noteElement.dataset.id;
      btnDelete.value = noteId;
      btnUpdate.value = noteId;
      getNotesById(noteId);
    });
  });
}

// Retrieve a specific note by its ID
function getNotesById(id) {
  fetch(`https://localhost:7260/api/Notes/${id}`)
    .then((response) => response.json())
    .then((data) => displayNoteInForm(data));
}

// Display a note in the form for editing
function displayNoteInForm(note) {
  titleInput.value = note.title;
  descriptionInput.value = note.description;
}

// Delete a note
function deleteNote(id) {
  fetch(`https://localhost:7260/api/Notes/${id}`, {
    method: "DELETE",
  }).then(() => {
    alert("Note deleted successfully.");
    clearForm();
    getAllNotes();
  });
}

// Update a note
function updateNote(id) {
  const updatedData = {
    title: titleInput.value,
    description: descriptionInput.value,
    isVisible: true,
  };

  fetch(`https://localhost:7260/api/Notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log the server response
      clearForm();
      getAllNotes();
    });
}

// Event listeners
saveButton.addEventListener("click", function () {
  addNote(titleInput.value, descriptionInput.value);
});

btnDelete.addEventListener("click", function () {
  deleteNote(btnDelete.value);
});

btnUpdate.addEventListener("click", function () {
  updateNote(btnUpdate.value);
});
