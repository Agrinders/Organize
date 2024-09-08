// Load saved clothes data from localStorage or initialize empty
let clothes = JSON.parse(localStorage.getItem('clothes')) || [];

// Function to show appropriate section
function openSection(section) {
    document.getElementById('login-screen').classList.add('hidden');
    if (section === 'clothes') {
        document.getElementById('clothes-section').classList.remove('hidden');
        displayClothes();
    } else if (section === 'outfits') {
        document.getElementById('outfits-section').classList.remove('hidden');
        displayOutfits();
    }
}

// Go back to login screen
function goBack() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('clothes-section').classList.add('hidden');
    document.getElementById('outfits-section').classList.add('hidden');
}

// Show add cloth form
function showAddClothesForm() {
    document.getElementById('add-cloth-form').classList.remove('hidden');
}

// Add new cloth
function addCloth() {
    const name = document.getElementById('name').value;
    const images = document.getElementById('images').value.split(',').map(img => img.trim()).filter(img => img); // Handle single or multiple images
    const price = document.getElementById('price').value;
    const link = document.getElementById('link').value;

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
                <a href="${cloth.link}" target="_blank">Buy Now</a>
                <button onclick="deleteCloth(${index})">Delete</button>
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

// Display outfits (To be expanded)
function displayOutfits() {
    const outfitsList = document.getElementById('outfits-list');
    outfitsList.innerHTML = '<p>Outfits coming soon...</p>';
}
