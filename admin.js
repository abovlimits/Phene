// Check if user is logged in and if they are an admin
if (!localStorage.getItem('isAdmin')) {
    window.location.href = 'admin_login.html';  // Redirect to login page
}

// Logout function
function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'admin_login.html';  // Redirect to login page
}

// Add product form submission
document.getElementById('add-product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const imageInput = document.getElementById('product-image').files[0];

    // Get specifications
    const specs = {
        Warranty: document.getElementById('warranty').value,
        "Model #": document.getElementById('model').value,
        CPU: document.getElementById('cpu').value,
        GPU: document.getElementById('gpu').value,
        RAM: document.getElementById('ram').value,
        Storage: document.getElementById('storage').value,
        Color: document.getElementById('color').value
    };

    // Collect upgrades
    const upgrades = [];
    const upgradeNames = document.getElementsByClassName('upgrade-name');
    const upgradePrices = document.getElementsByClassName('upgrade-cost');

    // Collect all upgrades
    for (let i = 0; i < upgradeNames.length; i++) {
        const upgradeName = upgradeNames[i].value;
        const upgradePrice = upgradePrices[i].value;
        if (upgradeName && upgradePrice) {
            upgrades.push({ name: upgradeName, price: parseFloat(upgradePrice) });
        }
    }

    // Ensure the user has selected an image
    if (!imageInput) {
        alert('Please select an image.');
        return;
    }

    // Use FileReader to convert the image file to a Base64 string
    const fileReader = new FileReader();
    fileReader.onloadend = function () {
        const imageBase64 = fileReader.result; // Base64 encoded image string

        // Create the new product object
        const product = {
            name,
            price,
            image: imageBase64,
            specs,
            upgrades // Include upgrades in the product
        };

        // Get the existing products from localStorage
        const products = JSON.parse(localStorage.getItem('products')) || [];

        // Add the new product to the products array
        products.push(product);

        // Save the updated products list to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Reset the form and update product list
        document.getElementById('add-product-form').reset();
        displayAdminProducts(); // Refresh the products list in the admin panel
    };

    fileReader.readAsDataURL(imageInput); // Read the image as Base64
});

// Display products list in the Admin Panel
function displayAdminProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear the current product list

    // Loop through each product and display it in the admin panel
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <img src="${product.image}" alt="${product.name}" style="max-width: 200px;">
            <p>Specs: ${JSON.stringify(product.specs)}</p>
            <p>Upgrades: ${product.upgrades.map(upgrade => `${upgrade.name} - ރ${upgrade.price}`).join(', ')}</p>
            <button onclick="removeProduct(${index})">Remove Product</button>
            <hr>
        `;
        productList.appendChild(productDiv);
    });
}

// Remove product from the list (Admin only)
function removeProduct(index) {
    // Get the existing products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Remove the product from the array
    products.splice(index, 1);

    // Save the updated products list to localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Refresh product list
    displayAdminProducts();
}

// Add an upgrade input field dynamically
function addUpgradeField() {
    const upgradesContainer = document.getElementById('upgrades-container');
    const upgradeDiv = document.createElement('div');
    upgradeDiv.classList.add('upgrade');
    upgradeDiv.innerHTML = `
        <label for="upgrade-name">Upgrade Name:</label>
        <input type="text" class="upgrade-name" placeholder="e.g., Extra RAM" required>

        <label for="upgrade-price">Upgrade Price:</label>
        <input type="number" class="upgrade-cost" placeholder="e.g., 100" required>
    `;
    upgradesContainer.appendChild(upgradeDiv);
}

// Initialize the admin panel by displaying the current products
displayAdminProducts();
