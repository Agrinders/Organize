// Load saved clothes data from localStorage or initialize empty
let clothes = JSON.parse(localStorage.getItem('clothes')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];

let editIndex = -1;

// Show add notes form
function showAddNotesForm() {

    document.getElementById('add-note-form').classList.remove('hidden');
    document.getElementById('edit-note-form').classList.add('hidden');
    editIndex = -1; // Reset edit index
}

// Show edit note form
function showEditNoteForm(index) {
    const note = notes[index];
    if (note) {
        document.getElementById('edit-note-title').value = note.title;
        document.getElementById('edit-note-content').value = note.content;
        
        document.getElementById('add-note-form').classList.add('hidden');
        document.getElementById('edit-note-form').classList.remove('hidden');
        
        // Update the save button to edit the note
        const saveButton = document.getElementById('save-note-button');
        if (saveButton) {
            saveButton.onclick = editNote;
        } else {
            console.error('Save button not found');
        }

        // Set the editIndex to the index of the note being edited
        editIndex = index;
    } else {
        console.error('Note not found for index:', index);
    }
}

// Add new note
function addNote() {
    const title = document.getElementById('add-note-title').value;
    const content = document.getElementById('add-note-content').value;

    if (title && content) {
        const newNote = { title, content };
        notes.push(newNote);
        saveNotes();
        displayNotes();
        document.getElementById('add-note-form').classList.add('hidden');
        //clearNoteForm(); // Clear form after adding
    } else {
        alert('Please fill in all fields.');
    }
}

// Edit existing note
function editNote() {
    if (editIndex >= 0 && editIndex < notes.length) {
        const title = document.getElementById('edit-note-title').value;
        const content = document.getElementById('edit-note-content').value;

        if (title && content) {
            notes[editIndex] = { title, content }; // Update the note at editIndex
            saveNotes();
            displayNotes();
            document.getElementById('edit-note-form').classList.add('hidden');
            //clearNoteForm(); // Clear form after saving
            editIndex = -1; // Reset edit index
        } else {
            alert('Please fill in all fields.');
        }
    } else {
        alert('No note selected for editing.');
    }
}



// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}


// Display all notes
function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Clear current items

    notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        noteItem.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button class="delete" onclick="deleteNote(${index})">Delete</button>
            <button onclick="showEditNoteForm(${index})">Edit</button> <!-- Button to show edit form -->
        `;
        notesList.appendChild(noteItem);
    });
}

// Clear note form fields
function clearNoteForm() {
    const addNoteTitle = document.getElementById('add-note-title');
    const addNoteContent = document.getElementById('add-note-content');
    const editNoteTitle = document.getElementById('edit-note-title');
    const editNoteContent = document.getElementById('edit-note-content');

    if (addNoteTitle) addNoteTitle.value = '';
    if (addNoteContent) addNoteContent.value = '';
    if (editNoteTitle) editNoteTitle.value = '';
    if (editNoteContent) editNoteContent.value = '';
}

// Show note details for editing
function showNoteDetails(index) {
    const note = notes[index];
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
    
    document.getElementById('edit-note-form').classList.remove('hidden');
    
    // Update the save button to edit the note
    const saveButton = document.querySelector('#edit-note-form button');
    saveButton.onclick = editNote;

    // Set the editIndex to the index of the note being edited
    editIndex = index;
}


// Initialize the notes list on page load
document.addEventListener('DOMContentLoaded', () => {
    displayNotes();
});

// Show notes section and display notes
function openSection(section) {
    document.getElementById('login-screen').classList.add('hidden');
    if (section === 'clothes') {
        document.getElementById('clothes-section').classList.remove('hidden');
        displayClothes();
    } else if (section === 'outfits') {
        document.getElementById('outfits-section').classList.remove('hidden');
        displayOutfits();
    } else if (section === 'notes') {
        document.getElementById('notes-section').classList.remove('hidden');
        displayNotes();
    }
}


function clearNoteForm() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
}

// Go back to login screen
function goBack() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('clothes-section').classList.add('hidden');
    document.getElementById('outfits-section').classList.add('hidden');
    document.getElementById('notes-section').classList.add('hidden');
}

// Show add cloth form
function showAddClothesForm() {
    document.getElementById('add-cloth-form').classList.remove('hidden');
}

// Add new cloth
function addCloth() {
    const name = document.getElementById('add-name').value;
    const images = document.getElementById('add-images').value.split(',').map(img => img.trim()).filter(img => img); // Handle single or multiple images
    const price = document.getElementById('add-price').value;
    const link = document.getElementById('add-link').value;

    if (name && images.length && price && link) {
        const newCloth = { name, images, price, link, currentIndex: 0 };
        clothes.push(newCloth);
        saveClothes();
        displayClothes();
        document.getElementById('add-cloth-form').classList.add('hidden');
    } else {
        alert('Please fill in all fields.');
    }
}

// Convert old data format to new format
function convertOldData() {
    const oldClothes = JSON.parse(localStorage.getItem('clothes')) || [];
    const updatedClothes = oldClothes.map(cloth => {
        if (cloth.image && !Array.isArray(cloth.images)) {
            return {
                ...cloth,
                images: [cloth.image], // Convert single image to an array
                currentIndex: 0
            };
        }
        return cloth; // Already in correct format
    });
    localStorage.setItem('clothes', JSON.stringify(updatedClothes));
}

// Run this function once to convert old data
convertOldData();


// Display all clothes
function displayClothes() {
    const clothesList = document.getElementById('clothes-list');
    clothesList.innerHTML = ''; // Clear current items

    clothes.forEach((cloth, index) => {
        if (cloth.images && Array.isArray(cloth.images)) {
            const clothItem = document.createElement('div');
            clothItem.classList.add('cloth-item');

            // Generate gallery HTML with navigation arrows
            const galleryHTML = `
                <div class="image-gallery">
                    ${cloth.images.map((img, imgIndex) => `
                        <img src="${img}" class="${imgIndex === cloth.currentIndex ? 'show' : 'hide'}" alt="${cloth.name}">
                    `).join('')}
                    ${cloth.images.length > 1 ? `
                        <button class="arrow arrow-left" onclick="changeImage(${index}, -1)">&#10094;</button>
                        <button class="arrow arrow-right" onclick="changeImage(${index}, 1)">&#10095;</button>
                    ` : ''}
                </div>
            `;

            clothItem.innerHTML = `
                ${galleryHTML}
                <p><strong>${cloth.name}</strong></p>
                <p>Price: ${cloth.price}</p>
                <a href="${cloth.link}" class="button-link" target="_blank">Buy Now</a>
                <button class="delete" onclick="deleteCloth(${index})">Delete</button>
            `;

            clothesList.appendChild(clothItem);
        } else {
            console.error('Cloth item is missing images or images is not an array:', cloth);
        }
    });
}

// Change image in gallery
function changeImage(clothIndex, direction) {
    const cloth = clothes[clothIndex];
    const numImages = cloth.images.length;

    // Update the currentIndex based on direction
    cloth.currentIndex = (cloth.currentIndex + direction + numImages) % numImages;
    saveClothes(); // Save the updated list to localStorage
    displayClothes(); // Refresh the displayed list
}

// Save clothes to localStorage
function saveClothes() {
    localStorage.setItem('clothes', JSON.stringify(clothes));
}

// Delete a cloth item
function deleteCloth(index) {
    clothes.splice(index, 1); // Remove the item from the array
    saveClothes(); // Save the updated list to localStorage
    displayClothes(); // Refresh the displayed list
}

// Delete a cloth item
function deleteNote(index) {
    notes.splice(index, 1); // Remove the item from the array
    saveNotes(); // Save the updated list to localStorage
    displayNotes(); // Refresh the displayed list
}

// Display outfits (To be expanded)
function displayOutfits() {
    const outfitsList = document.getElementById('outfits-list');
    outfitsList.innerHTML = '<p>Outfits coming soon...</p>';
}


// Export clothes data to JSON file
function exportClothes() {
    const dataStr = JSON.stringify(clothes, null, 2); // Convert clothes array to JSON string with pretty formatting
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clothes-data.json';
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL object
}

// Handle file selection and import data
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    clothes = data;
                    saveClothes(); // Save to localStorage
                    displayClothes(); // Refresh the display
                } else {
                    alert('Invalid data format');
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a valid JSON file');
    }
}
