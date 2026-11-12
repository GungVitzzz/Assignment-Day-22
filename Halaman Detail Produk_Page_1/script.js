"use strict";

const maxCartCapacity = 10;

const product = {
  unitPrice: 135,
  currency: "GBP",
  locale: "en-GB",
  size: "100 ml",
  stock: 10,
  images: [
    {
      src: "assets/molecule-01-champaca-bottle.jpg",
      alt: "Botol parfum Molecule 01 + Champaca 100 ml",
      label: "botol parfum",
    },
    {
      src: "assets/molecule-01-champaca-detail.jpg",
      alt: "Detail produk Molecule 01 + Champaca",
      label: "detail parfum",
    },
    {
      src: "assets/molecule-01-champaca-box.jpg",
      alt: "Botol dan kemasan Molecule 01 + Champaca",
      label: "botol dan kemasan",
    },
  ],
};

const formatPrice = new Intl.NumberFormat(product.locale, {
  style: "currency",
  currency: product.currency,
  maximumFractionDigits: 0,
});

const mainImage = document.querySelector(".main-image");
const thumbnails = [...document.querySelectorAll(".thumbnail")];
const imageCounter = document.querySelector(".gallery-count");
const galleryStage = document.querySelector(".gallery-stage");
const quantityOutput = document.querySelector("#quantity");
const quantityError = document.querySelector("#quantity-error");
const decreaseButton = document.querySelector("#decrease-quantity");
const increaseButton = document.querySelector("#increase-quantity");
const subtotalOutput = document.querySelector("#subtotal");
const buttonTotal = document.querySelector("#button-total");
const addToBagControls = [
  ...document.querySelectorAll(".add-to-bag, .add-to-cart"),
].map((button) => {
  const label = button.querySelector(".button-label");
  if (!label) {
    throw new Error("Add-to-cart buttons must contain a .button-label element.");
  }

  return {
    button,
    label,
    defaultLabel: label.textContent.trim(),
  };
});
const cartCountOutput = document.querySelector("#cart-count");
const cartLink = document.querySelector(".bag-link");
const cartPanel = document.querySelector("#shopping-cart");
const cartItem = document.querySelector("#cart-item");
const cartEmpty = document.querySelector("#cart-empty");
const cartQuantityOutput = document.querySelector("#cart-quantity");
const cartSubtotalOutput = document.querySelector("#cart-subtotal");
const removeCartItemButton = document.querySelector("#remove-cart-item");
const addCartItemButton = document.querySelector("#add-cart-item");
const cartCapacityMessage = document.querySelector("#cart-capacity-message");
const wishlistButton = document.querySelector("#wishlist");
const wishlistLabel = wishlistButton.querySelector(".wishlist-label");
const headerWishlistButton = document.querySelector(".wishlist-header");
const feedback = document.querySelector("#action-feedback");
const menuButton = document.querySelector(".menu-button");
const menuPanel = document.querySelector("#site-navigation");
const newsletterForm = document.querySelector("#newsletter-form");
const newsletterEmailInput = document.querySelector("#newsletter-email");
const newsletterStatus = document.querySelector("#newsletter-status");
const quantityGroup = document.querySelector(".quantity-control");
const gallery = document.querySelector(".gallery");

let selectedImage = 0;
let quantity = 1;
let quantityInputIsValid = true;
let cartCount = 0;
const imageZoomScale = 1.8;
const normalCartCapacityMessage =
  "Anda masih dapat menambahkan produk ke keranjang.";
const fullCartCapacityMessage =
  `Keranjang sudah penuh (${maxCartCapacity} item). Kurangi item untuk menambahkan produk lain.`;

function announceChange() {
  feedback.hidden = true;
  feedback.textContent = "";
}

function setImage(index) {
  selectedImage = (index + product.images.length) % product.images.length;
  const image = product.images[selectedImage];

  mainImage.src = image.src;
  mainImage.alt = image.alt;
  imageCounter.innerHTML = `${String(selectedImage + 1).padStart(2, "0")} <span aria-hidden="true">/</span> ${String(product.images.length).padStart(2, "0")}`;

  thumbnails.forEach((thumbnail, thumbnailIndex) => {
    const isSelected = thumbnailIndex === selectedImage;
    thumbnail.classList.toggle("is-active", isSelected);
    thumbnail.setAttribute("aria-pressed", String(isSelected));
  });

  announceChange();
}

function renderQuantity() {
  const maxSelectableQuantity = Math.max(
    1,
    Math.min(product.stock, maxCartCapacity - cartCount),
  );
  quantity = Math.min(quantity, maxSelectableQuantity);
  const total = product.unitPrice * quantity;

  quantityOutput.value = String(quantity);
  quantityOutput.setAttribute("aria-invalid", "false");
  quantityError.textContent = "";
  quantityError.hidden = true;
  quantityInputIsValid = true;
  subtotalOutput.textContent = formatPrice.format(total);
  buttonTotal.textContent = formatPrice.format(total);
  decreaseButton.disabled = quantity <= 1;
  increaseButton.disabled = quantity >= maxSelectableQuantity;
  const cartIsFull = cartCount >= maxCartCapacity;
  addToBagControls.forEach(({ button, label, defaultLabel }) => {
    button.disabled = cartIsFull;
    label.textContent = cartIsFull ? "Keranjang Penuh" : defaultLabel;
  });
  increaseButton.setAttribute(
    "aria-label",
    quantity >= maxSelectableQuantity
      ? `Maximum quantity ${Math.min(product.stock, maxSelectableQuantity)}`
      : "Increase quantity for Molecule 01 + Champaca",
  );
  announceChange();
}

function validateQuantityInput() {
  const rawValue = quantityOutput.value.trim();
  const value = Number(rawValue);
  const availableCartCapacity = maxCartCapacity - cartCount;
  const isInteger = /^[+-]?\d+$/.test(rawValue);
  const isNumeric = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(rawValue);
  let errorMessage = "";

  if (rawValue === "") {
    errorMessage = "Masukkan jumlah produk.";
  } else if (!isNumeric) {
    errorMessage = "Masukkan nilai angka yang valid.";
  } else if (!isInteger) {
    errorMessage = "Jumlah produk harus berupa bilangan bulat.";
  } else if (!Number.isSafeInteger(value)) {
    errorMessage = `Jumlah melebihi stok yang tersedia (${product.stock} item).`;
  } else if (value < 1) {
    errorMessage = "Jumlah produk minimal 1.";
  } else if (value > product.stock) {
    errorMessage = `Jumlah melebihi stok yang tersedia (${product.stock} item).`;
  } else if (value > availableCartCapacity) {
    errorMessage = `Anda hanya dapat menambahkan ${availableCartCapacity} item lagi karena batas kapasitas keranjang.`;
  }

  quantityInputIsValid = errorMessage === "";
  quantityOutput.setAttribute(
    "aria-invalid",
    String(!quantityInputIsValid),
  );
  quantityError.textContent = errorMessage;
  quantityError.hidden = quantityInputIsValid;

  if (quantityInputIsValid) {
    quantity = value;
    renderQuantity();
  } else {
    const cartIsFull = cartCount >= maxCartCapacity;
    addToBagControls.forEach(({ button, label, defaultLabel }) => {
      button.disabled = true;
      label.textContent = cartIsFull ? "Keranjang Penuh" : defaultLabel;
    });
  }
}

function renderCart() {
  quantity = Math.min(
    quantity,
    Math.max(1, Math.min(product.stock, maxCartCapacity - cartCount)),
  );

  cartCountOutput.textContent = String(cartCount);
  cartQuantityOutput.textContent = String(cartCount);
  cartSubtotalOutput.textContent = formatPrice.format(
    product.unitPrice * cartCount,
  );
  cartItem.hidden = cartCount === 0;
  cartEmpty.hidden = cartCount > 0;
  removeCartItemButton.disabled = cartCount === 0;
  const isFull = cartCount >= maxCartCapacity;
  addCartItemButton.disabled = isFull;
  addCartItemButton.setAttribute(
    "aria-label",
    isFull ? "Keranjang sudah penuh" : "Tambah satu barang",
  );
  cartCapacityMessage.textContent = isFull
    ? fullCartCapacityMessage
    : normalCartCapacityMessage;
  cartCapacityMessage.classList.toggle("is-full", isFull);
  cartLink.setAttribute("aria-label", `Keranjang, ${cartCount} item`);
  renderQuantity();
}

function moveZoomedImage(event) {
  if (!galleryStage.classList.contains("is-zoomed") || event.pointerType === "touch") {
    return;
  }

  const bounds = galleryStage.getBoundingClientRect();
  const maxPanX = (bounds.width * (imageZoomScale - 1)) / 2;
  const maxPanY = (bounds.height * (imageZoomScale - 1)) / 2;
  const pointerX = (event.clientX - bounds.left) / bounds.width;
  const pointerY = (event.clientY - bounds.top) / bounds.height;
  const panX = (0.5 - pointerX) * 2 * maxPanX;
  const panY = (0.5 - pointerY) * 2 * maxPanY;

  galleryStage.style.setProperty("--pan-x", `${panX}px`);
  galleryStage.style.setProperty("--pan-y", `${panY}px`);
}

function resetImageZoom() {
  galleryStage.classList.remove("is-zoomed");
  galleryStage.style.removeProperty("--pan-x");
  galleryStage.style.removeProperty("--pan-y");
}

mainImage.addEventListener("click", () => {
  if (galleryStage.classList.contains("is-zoomed")) {
    resetImageZoom();
    return;
  }

  galleryStage.classList.add("is-zoomed");
});
galleryStage.addEventListener("pointermove", moveZoomedImage);
galleryStage.addEventListener("pointerleave", resetImageZoom);

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => setImage(index));
});

gallery.querySelector(".gallery-arrow--previous").addEventListener("click", () => {
  setImage(selectedImage - 1);
});

gallery.querySelector(".gallery-arrow--next").addEventListener("click", () => {
  setImage(selectedImage + 1);
});

decreaseButton.addEventListener("click", () => {
  if (quantity > 1) {
    quantity -= 1;
    renderQuantity();
  }
});

quantityOutput.addEventListener("input", validateQuantityInput);
quantityOutput.addEventListener("change", validateQuantityInput);

increaseButton.addEventListener("click", () => {
  const maxSelectableQuantity = Math.max(
    1,
    Math.min(product.stock, maxCartCapacity - cartCount),
  );
  if (quantity < maxSelectableQuantity) {
    quantity += 1;
    renderQuantity();
  }
});

quantityGroup.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    increaseButton.click();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    decreaseButton.click();
  }
});

addToBagControls.forEach(({ button }) => {
  button.addEventListener("click", () => {
    if (!quantityInputIsValid) {
      validateQuantityInput();
      return;
    }

    const quantityToAdd = Math.min(
      quantity,
      maxCartCapacity - cartCount,
    );
    if (quantityToAdd <= 0) return;

    cartCount += quantityToAdd;
    renderCart();
    feedback.textContent = `${quantityToAdd} item ditambahkan. Total keranjang: ${cartCount}.`;
    feedback.hidden = false;
  });
});

cartLink.addEventListener("click", () => {
  const isOpen = cartLink.getAttribute("aria-expanded") === "true";
  cartLink.setAttribute("aria-expanded", String(!isOpen));
  cartPanel.hidden = isOpen;

  if (!isOpen) {
    menuButton.setAttribute("aria-expanded", "false");
    menuPanel.hidden = true;
  }
});

document.addEventListener("click", (event) => {
  if (
    cartPanel.hidden ||
    cartPanel.contains(event.target) ||
    cartLink.contains(event.target)
  ) {
    return;
  }

  cartPanel.hidden = true;
  cartLink.setAttribute("aria-expanded", "false");
});

removeCartItemButton.addEventListener("click", () => {
  if (cartCount === 0) return;

  cartCount -= 1;
  renderCart();
  feedback.textContent = `1 item dihapus. Total keranjang: ${cartCount}.`;
  feedback.hidden = false;
});

addCartItemButton.addEventListener("click", () => {
  if (cartCount >= maxCartCapacity) return;

  cartCount += 1;
  renderCart();
  feedback.textContent = `1 item ditambahkan. Total keranjang: ${cartCount}.`;
  feedback.hidden = false;
});

wishlistButton.addEventListener("click", () => {
  const isPressed = wishlistButton.getAttribute("aria-pressed") === "true";
  const nextIsPressed = !isPressed;

  wishlistButton.setAttribute("aria-pressed", String(nextIsPressed));
  wishlistButton.setAttribute(
    "aria-label",
    nextIsPressed ? "Remove from wishlist" : "Add to wishlist",
  );
  wishlistLabel.textContent = nextIsPressed
    ? "Added to wishlist"
    : "Add to wishlist";
  headerWishlistButton.setAttribute(
    "aria-pressed",
    String(nextIsPressed),
  );
  headerWishlistButton.setAttribute(
    "aria-label",
    nextIsPressed ? "Remove from wishlist" : "Add to wishlist",
  );
  announceChange();
  feedback.textContent = nextIsPressed
    ? "Molecule 01 + Champaca sudah ditambahkan ke wishlist."
    : "Molecule 01 + Champaca dihapus dari wishlist.";
  feedback.hidden = false;
});

headerWishlistButton.addEventListener("click", () => {
  wishlistButton.click();
});

newsletterEmailInput.addEventListener("input", () => {
  newsletterEmailInput.setAttribute("aria-invalid", "false");
  newsletterStatus.classList.remove("is-error");
  newsletterStatus.classList.remove("is-valid");
  newsletterStatus.textContent = "";
  newsletterStatus.hidden = true;
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletterEmailInput.value.trim();
  let errorMessage = "";

  if (!email) {
    errorMessage = "Masukkan alamat email.";
  } else if (!newsletterEmailInput.validity.valid) {
    errorMessage = "Masukkan alamat email dengan format yang valid.";
  }

  const isValid = errorMessage === "";
  newsletterEmailInput.setAttribute("aria-invalid", String(!isValid));
  newsletterStatus.classList.toggle("is-error", !isValid);
  newsletterStatus.classList.toggle("is-valid", isValid);
  newsletterStatus.textContent = isValid
    ? "Alamat email valid. Pendaftaran newsletter belum diaktifkan."
    : errorMessage;
  newsletterStatus.hidden = false;
});

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuPanel.hidden = isExpanded;
});

menuPanel.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuButton.setAttribute("aria-expanded", "false");
    menuPanel.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!menuPanel.hidden) {
      menuButton.setAttribute("aria-expanded", "false");
      menuPanel.hidden = true;
      menuButton.focus();
    } else if (!cartPanel.hidden) {
      cartLink.setAttribute("aria-expanded", "false");
      cartPanel.hidden = true;
      cartLink.focus();
    }
  }
});

document.querySelector("#current-year").textContent = String(
  new Date().getFullYear(),
);

renderCart();
