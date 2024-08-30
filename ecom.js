document.addEventListener("DOMContentLoaded", () => {
  // Function for displaying the cart
  window.displayCart = () => {
    document.getElementById("cart").classList.add("showCart");
  }

  // Function for hiding the cart
  window.hideCart = () => {
    document.getElementById("cart").classList.remove("showCart");
  }

  // Array of products
  let cartItems = [];

  // Fetching products through API
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
      cartItems = products;
      products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");
        productCard.innerHTML = `
          <div class="card mt-4">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text text-success">Price: $${product.price}</p>
              <div class="mt-auto">
                <a href="#" class="btn btn-primary" onclick="addToCart(${product.id})">Add to cart</a>
                <button type="button" class="btn btn-primary mt-2" onclick="showModal(${product.id})">View More</button>
              </div>
            </div>
          </div>
        `;
        document.getElementById("product-container").appendChild(productCard);
      });
    });

  // Array of products in the cart
  let cart = [];

  // Add to cart function
  window.addToCart = (id) => {
    const selectedItem = cartItems.find(item => item.id === id);
    if (selectedItem) {
      cart.push(selectedItem);
      updateCart();
      itemsCount();
      totalPrice();
    }
  }

  // Remove product from cart
  window.remove = (index) => {
    cart.splice(index, 1);
    updateCart();
    itemsCount();
    totalPrice();
  }

  // Update cart display
  function updateCart() {
    const cartContainer = document.getElementById("div");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <img src="img/empty-cart.png" class="img-fluid" alt="Cart is empty" style="max-width: 500px;">
        <h1>Cart is Empty</h1>
      `;
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("d-flex", "bg-light", "p-3", "mb-3");
      cartItem.innerHTML = `
        <img src="${item.image}" class="me-3" style="width: 150px; height: 100px;">
        <div class="d-flex flex-column">
          <h4>${item.title}</h4>
          <h5 class="text-success">Price: $${item.price}</h5>
          <button class="btn btn-primary mt-2" onclick="remove(${index})">Remove from cart</button>
        </div>
      `;
      cartContainer.appendChild(cartItem);
    });
  }

  // Count items in the cart
  function itemsCount() {
    document.getElementById("productCount").innerText = `Added Products: ${cart.length}`;
    document.getElementById("productCount").style.display = cart.length ? "block" : "none";
  }

  // Calculate total price of products in the cart
  function totalPrice() {
    const amount = cart.reduce((acc, item) => acc + item.price, 0);
    document.getElementById("totalPrice").innerText = `Total Price: $${amount.toFixed(2)}`;
    document.getElementById("totalPrice").style.display = cart.length ? "block" : "none";
  }

  // Empty the cart
  window.emptyCart = () => {
    cart = [];
    updateCart();
    itemsCount();
    totalPrice();
  }

  // Show product details in modal
  window.showModal = (productId) => {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(response => response.json())
      .then(product => {
        const modalId = `productModal-${productId}`;
        const modalContent = `
          <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="staticBackdropLabel">${product.category}</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex flex-column flex-md-row">
                  <img src="${product.image}" alt="${product.title}" class="img-fluid mb-3 mb-md-0" style="max-width: 250px;">
                  <div class="container">
                    <h3><b>Title:</b> ${product.title}</h3>
                    <p><b>Description:</b> ${product.description}</p>
                    <p><b>Ratings:</b> ${product.rating.rate}</p>
                    <p><b>Reviews:</b> ${product.rating.count}</p>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        `;
        document.getElementById("modal-container").innerHTML = modalContent;

        const modalElement = document.getElementById(modalId);
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      });
  }
});