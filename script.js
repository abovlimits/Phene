function displayProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productGrid = document.getElementById('product-grid');

    // Clear the current product grid
    productGrid.innerHTML = '';

    // Loop through the products and create product cards dynamically
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Create the card content
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: ${product.price} ރ</p>
            <a href="#" class="view-details" onclick="showSpecs(event, ${index}); return false;">View Details</a>
        `;

        // Append the product card to the grid
        productGrid.appendChild(productCard);
    });
}

// Show product specifications in a modal when the "View Details" button is clicked
function showSpecs(event, index) {
    event.preventDefault(); // Prevent the default action for the link

    // Get the product data from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index]; // Get the selected product

    // Hide the product grid and show the specs modal
    document.getElementById('product-grid').style.display = 'grid';
    const specsModal = document.getElementById('specs-modal');
    const specsContainer = document.getElementById('product-specs');

    let specsHtml = '';

    // Dynamically create specifications based on the product data
    for (const key in product.specs) {
        if (product.specs.hasOwnProperty(key)) {
            specsHtml += `<p><strong>${key}:</strong> ${product.specs[key]}</p>`;
        }
    }

    // Add available upgrades if there are any
    if (product.upgrades && product.upgrades.length > 0) {
        specsHtml += '<h4>Available Upgrades:</h4><ul>';
        product.upgrades.forEach(upgrade => {
            specsHtml += `<li><strong>${upgrade.name}:</strong> $${upgrade.price}</li>`;
        });
        specsHtml += '</ul>';
    }

    specsContainer.innerHTML = specsHtml;
    specsModal.style.display = 'block'; // Show the modal
}

// Close the modal and show the product grid again
function closeModal() {
    document.getElementById('specs-modal').style.display = 'none';
    document.getElementById('product-grid').style.display = 'grid'; // Show the product grid again
}

// Initialize product list
if (document.getElementById('product-grid')) {
    displayProducts();
}

// Handle the form submission to add a new product in the admin panel
document.getElementById('product-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the values from the form
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const imageInput = document.getElementById('image');
    
    const specs = {
        Warranty: document.getElementById('warranty').value,
        "Model #": document.getElementById('model').value,
        CPU: document.getElementById('cpu').value,
        GPU: document.getElementById('gpu').value,
        Display: document.getElementById('display').value,
        RAM: document.getElementById('ram').value,
        Storage: document.getElementById('storage').value,
        Color: document.getElementById('color').value,
        Camera: document.getElementById('camera').value,
        Audio: document.getElementById('audio').value,
        Input: document.getElementById('input').value,
        Ports: document.getElementById('ports').value,
        Network: document.getElementById('network').value,
        Battery: document.getElementById('battery').value,
        "Size & Weight": document.getElementById('size').value
    };

    // Get the upgrade details from the form
    const upgrades = [];
    const upgradeNames = document.getElementsByClassName('upgrade-name');
    const upgradePrices = document.getElementsByClassName('upgrade-cost');

    for (let i = 0; i < upgradeNames.length; i++) {
        const name = upgradeNames[i].value;
        const price = upgradePrices[i].value;

        if (name && price) { // Only add upgrades with both name and price
            upgrades.push({ name, price: parseFloat(price) }); // Ensure the price is a number
        }
    }

    // Convert image file to base64
    const fileReader = new FileReader();
    fileReader.onloadend = function () {
        const imageBase64 = fileReader.result;

        // Create the product object
        const product = {
            name,
            price,
            image: imageBase64,
            specs,
            upgrades // Include upgrades
        };

        // Get the existing products from localStorage
        const products = JSON.parse(localStorage.getItem('products')) || [];

        // Add the new product to the list
        products.push(product);

        // Save the updated products list to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Display success message
        const successMessage = document.createElement('div');
        successMessage.innerHTML = '<p>Product successfully added!</p>';
        successMessage.style.backgroundColor = '#4CAF50';
        successMessage.style.color = 'white';
        successMessage.style.padding = '10px';
        successMessage.style.marginTop = '20px';
        successMessage.style.borderRadius = '5px';
        document.getElementById('product-form').appendChild(successMessage);

        // Clear form fields (optional)
        document.getElementById('product-form').reset();

        // Refresh product list
        displayProducts();
    };

    fileReader.readAsDataURL(imageInput.files[0]);
});

// Remove product from the list
function removeProduct(event, index) {
    event.stopPropagation(); // Prevent triggering the click event on the product card

    // Get the existing products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Remove the product from the array
    products.splice(index, 1);

    // Save the updated products list to localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Refresh product list
    displayProducts();
}
