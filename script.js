const DEFAULT_USER = {
  email: "customer@uptag.com",
  password: "uppie123",
  name: "Prototype Customer",
  phone: "(555) 014-7788",
  tagNickname: "Main Travel Tag",
  tagId: "UP1001"
};

const fakeTags = {
  UP1001: {
    owner: "Naruto Uzumaki",
    tagId: "UP1001",
    flight: "UA 248",
    route: "JFK → LAX",
    departure: "7:40 PM",
    status: "Boarding in 42 min",
    gate: "B12",
    baggage: "Checked In"
  },
  UP1002: {
    owner: "Monkey D. Luffy",
    tagId: "UP1002",
    flight: "DL 517",
    route: "BUF → MIA",
    departure: "3:15 PM",
    status: "Delayed 20 min",
    gate: "A4",
    baggage: "Loaded"
  },
  UP2001: {
    owner: "Son Goku",
    tagId: "UP2001",
    flight: "BA 178",
    route: "NYC → LON",
    departure: "10:10 PM",
    status: "Checked In",
    gate: "C9",
    baggage: "Awaiting Drop-Off"
  },
  UP3001: {
    owner: "Ash Ketchum",
    tagId: "UP3001",
    flight: "AA 904",
    route: "ORD → DFW",
    departure: "1:55 PM",
    status: "Tag Signal Reconnecting",
    gate: "D5",
    baggage: "Location Refreshing"
  }
};

function setLoggedInUser(user) {
  localStorage.setItem("uptagUser", JSON.stringify(user));
}

function getLoggedInUser() {
  const user = localStorage.getItem("uptagUser");
  return user ? JSON.parse(user) : null;
}

function logoutUser() {
  localStorage.removeItem("uptagUser");
}

function resetUserProfile() {
  const user = {
    email: DEFAULT_USER.email,
    name: DEFAULT_USER.name,
    phone: DEFAULT_USER.phone,
    tagNickname: DEFAULT_USER.tagNickname,
    tagId: DEFAULT_USER.tagId
  };
  setLoggedInUser(user);
  return user;
}

function getTagData(tagId) {
  if (!tagId) return null;
  return fakeTags[tagId.toUpperCase()] || null;
}

function getTagDisplayMessage() {
  return localStorage.getItem("uptagTagMessage") || "Boarding Soon";
}

function setTagDisplayMessage(message) {
  localStorage.setItem("uptagTagMessage", message);
}

function getTagDisplayMode() {
  return localStorage.getItem("uptagTagMode") || "text";
}

function setTagDisplayMode(mode) {
  localStorage.setItem("uptagTagMode", mode);
}

function getTagDisplayImage() {
  return localStorage.getItem("uptagTagImage") || "";
}

function setTagDisplayImage(imageData) {
  localStorage.setItem("uptagTagImage", imageData);
}

function removeTagDisplayImage() {
  localStorage.removeItem("uptagTagImage");
}

function getCart() {
  const cart = localStorage.getItem("uptagCart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("uptagCart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = totalQty;
  });
}

function formatPrice(num) {
  return `$${num.toFixed(2)}`;
}

function addCurrentProductToCart() {
  const messageEl = document.getElementById("cartMessage");
  const color = "Midnight Black";
  const model = "Standard";
  const cart = getCart();

  const existing = cart.find(
    (item) =>
      item.product === "UpTag Smart E-Luggage Tag" &&
      item.color === color &&
      item.model === model
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      product: "UpTag Smart E-Luggage Tag",
      color: color,
      model: model,
      price: 30.0,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();

  if (messageEl) {
    messageEl.textContent = "Added to cart.";
  }
}

function loadBuyPageCart() {
  const cart = getCart();

  const emptyCartMessage = document.getElementById("emptyCartMessage");
  const cartSummaryBox = document.getElementById("cartSummaryBox");
  const checkoutSection = document.getElementById("checkoutSection");

  if (!emptyCartMessage || !cartSummaryBox || !checkoutSection) return;

  if (cart.length === 0) {
    emptyCartMessage.classList.remove("hidden");
    cartSummaryBox.classList.add("hidden");
    checkoutSection.classList.add("hidden");
    return;
  }

  emptyCartMessage.classList.add("hidden");
  cartSummaryBox.classList.remove("hidden");
  checkoutSection.classList.remove("hidden");

  const firstItem = cart[0];
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  const buyProductName = document.getElementById("buyProductName");
  const buyModel = document.getElementById("buyModel");
  const buyColor = document.getElementById("buyColor");
  const buyQuantity = document.getElementById("buyQuantity");
  const buySubtotal = document.getElementById("buySubtotal");
  const buyShipping = document.getElementById("buyShipping");
  const buyTotal = document.getElementById("buyTotal");
  const payButtonText = document.getElementById("payButtonText");

  if (buyProductName) buyProductName.textContent = firstItem.product;
  if (buyModel) buyModel.textContent = firstItem.model;
  if (buyColor) buyColor.textContent = firstItem.color;
  if (buyQuantity) buyQuantity.textContent = String(quantity);
  if (buySubtotal) buySubtotal.textContent = formatPrice(subtotal);
  if (buyShipping) buyShipping.textContent = formatPrice(shipping);
  if (buyTotal) buyTotal.textContent = formatPrice(total);
  if (payButtonText) payButtonText.textContent = `Place Order • ${formatPrice(total)}`;
}

function setupProductGallery() {
  const mainImage = document.getElementById("mainProductImage");
  const thumbButtons = document.querySelectorAll(".thumb-btn");

  if (!mainImage || thumbButtons.length === 0) return;

  thumbButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const image = button.getAttribute("data-image");
      const alt = button.getAttribute("data-alt");

      if (image) mainImage.src = image;
      if (alt) mainImage.alt = alt;

      thumbButtons.forEach((btn) => btn.classList.remove("active-thumb"));
      button.classList.add("active-thumb");
    });
  });
}

function getRouteCodes(routeText) {
  if (!routeText) {
    return {
      departureCode: "---",
      arrivalCode: "---"
    };
  }

  const normalized = routeText.replace(/\s+/g, " ").trim();
  let parts = [];

  if (normalized.includes("→")) {
    parts = normalized.split("→");
  } else if (normalized.includes("->")) {
    parts = normalized.split("->");
  } else if (normalized.includes("-")) {
    parts = normalized.split("-");
  }

  parts = parts.map((part) => part.trim());

  return {
    departureCode: parts[0] || "---",
    arrivalCode: parts[1] || "---"
  };
}

function updateMainDashboardTracking(tagId) {
  const tag = getTagData(tagId);
  if (!tag) return;

  const routeCodes = getRouteCodes(tag.route);

  const dashTagId = document.getElementById("dashTagId");
  const dashFlight = document.getElementById("dashFlight");
  const dashRoute = document.getElementById("dashRoute");
  const dashDeparture = document.getElementById("dashDeparture");
  const dashStatus = document.getElementById("dashStatus");
  const dashGate = document.getElementById("dashGate");
  const dashBaggage = document.getElementById("dashBaggage");
  const dashDepartureCode = document.getElementById("dashDepartureCode");
  const dashArrivalCode = document.getElementById("dashArrivalCode");

  if (dashTagId) dashTagId.textContent = tag.tagId;
  if (dashFlight) dashFlight.textContent = tag.flight;
  if (dashRoute) dashRoute.textContent = tag.route;
  if (dashDeparture) dashDeparture.textContent = tag.departure;
  if (dashStatus) dashStatus.textContent = tag.status;
  if (dashGate) dashGate.textContent = tag.gate;
  if (dashBaggage) dashBaggage.textContent = tag.baggage;
  if (dashDepartureCode) dashDepartureCode.textContent = routeCodes.departureCode;
  if (dashArrivalCode) dashArrivalCode.textContent = routeCodes.arrivalCode;
}

function updateOtherTagTracking(tag) {
  const routeCodes = getRouteCodes(tag.route);

  document.getElementById("otherOwner").textContent = tag.owner;
  document.getElementById("otherTagId").textContent = tag.tagId;
  document.getElementById("otherFlight").textContent = tag.flight;
  document.getElementById("otherRoute").textContent = tag.route;
  document.getElementById("otherDeparture").textContent = tag.departure;
  document.getElementById("otherStatus").textContent = tag.status;
  document.getElementById("otherGate").textContent = tag.gate;
  document.getElementById("otherBaggage").textContent = tag.baggage;
  document.getElementById("otherDepartureCode").textContent = routeCodes.departureCode;
  document.getElementById("otherArrivalCode").textContent = routeCodes.arrivalCode;
}

function refreshTagDisplayUI() {
  const textWrap = document.getElementById("tagTextPreviewWrap");
  const imageWrap = document.getElementById("tagImagePreviewWrap");
  const textPreview = document.getElementById("tagDisplayPreview");
  const imagePreview = document.getElementById("tagImagePreview");
  const modeLabel = document.getElementById("tagModeLabel");

  if (!textWrap || !imageWrap || !textPreview || !imagePreview || !modeLabel) return;

  const currentMode = getTagDisplayMode();
  const currentMessage = getTagDisplayMessage();
  const currentImage = getTagDisplayImage();

  textPreview.textContent = currentMessage;

  if (currentImage) {
    imagePreview.src = currentImage;
  } else {
    imagePreview.removeAttribute("src");
  }

  if (currentMode === "image" && currentImage) {
    textWrap.classList.add("hidden");
    imageWrap.classList.remove("hidden");
    modeLabel.textContent = "Current mode: Image";
  } else {
    textWrap.classList.remove("hidden");
    imageWrap.classList.add("hidden");
    modeLabel.textContent = "Current mode: Text";
  }
}

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
      setLoggedInUser({
        email: DEFAULT_USER.email,
        name: DEFAULT_USER.name,
        phone: DEFAULT_USER.phone,
        tagNickname: DEFAULT_USER.tagNickname,
        tagId: DEFAULT_USER.tagId
      });

      window.location.href = "dashboard.html";
    } else if (loginMessage) {
      loginMessage.textContent = "Invalid login. Please use the customer access credentials.";
    }
  });
}

const dashboardMarker = document.getElementById("customerName");
const tagMessageForm = document.getElementById("tagMessageForm");
const tagMessageInput = document.getElementById("tagMessageInput");
const tagDisplayPreview = document.getElementById("tagDisplayPreview");
const tagMessageStatus = document.getElementById("tagMessageStatus");
const tagImageInput = document.getElementById("tagImageInput");
const removeTagImageBtn = document.getElementById("removeTagImageBtn");
const textModeBtn = document.getElementById("textModeBtn");
const imageModeBtn = document.getElementById("imageModeBtn");

if (dashboardMarker) {
  const user = getLoggedInUser();

  if (!user) {
    window.location.href = "login.html";
  } else {
    const customerName = document.getElementById("customerName");
    const profileNameDisplay = document.getElementById("profileNameDisplay");
    const customerEmail = document.getElementById("customerEmail");
    const customerPhone = document.getElementById("customerPhone");
    const customerTagNickname = document.getElementById("customerTagNickname");

    if (customerName) customerName.textContent = user.name;
    if (profileNameDisplay) profileNameDisplay.textContent = user.name;
    if (customerEmail) customerEmail.textContent = user.email;
    if (customerPhone) customerPhone.textContent = user.phone;
    if (customerTagNickname) customerTagNickname.textContent = user.tagNickname;

    updateMainDashboardTracking(user.tagId || DEFAULT_USER.tagId);

    const editName = document.getElementById("editName");
    const editPhone = document.getElementById("editPhone");
    const editTagNickname = document.getElementById("editTagNickname");
    const editTagId = document.getElementById("editTagId");

    if (editName) editName.value = user.name;
    if (editPhone) editPhone.value = user.phone;
    if (editTagNickname) editTagNickname.value = user.tagNickname;
    if (editTagId) editTagId.value = user.tagId || DEFAULT_USER.tagId;

    const savedMessage = getTagDisplayMessage();

    if (tagDisplayPreview) tagDisplayPreview.textContent = savedMessage;
    if (tagMessageInput) tagMessageInput.value = savedMessage;

    refreshTagDisplayUI();
  }
}

const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");

if (profileForm) {
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentUser = getLoggedInUser();
    if (!currentUser) return;

    const inputTagId = document.getElementById("editTagId");
    const nextTagId = inputTagId
      ? inputTagId.value.trim().toUpperCase()
      : (currentUser.tagId || DEFAULT_USER.tagId);

    if (!getTagData(nextTagId)) {
      if (profileMessage) {
        profileMessage.textContent = "Invalid tag code. Use UP1001, UP1002, UP2001, or UP3001.";
      }
      return;
    }

    const updatedUser = {
      ...currentUser,
      name: document.getElementById("editName").value.trim() || currentUser.name,
      phone: document.getElementById("editPhone").value.trim() || currentUser.phone,
      tagNickname: document.getElementById("editTagNickname").value.trim() || currentUser.tagNickname,
      tagId: nextTagId
    };

    setLoggedInUser(updatedUser);

    const customerName = document.getElementById("customerName");
    const profileNameDisplay = document.getElementById("profileNameDisplay");
    const customerPhone = document.getElementById("customerPhone");
    const customerTagNickname = document.getElementById("customerTagNickname");

    if (customerName) customerName.textContent = updatedUser.name;
    if (profileNameDisplay) profileNameDisplay.textContent = updatedUser.name;
    if (customerPhone) customerPhone.textContent = updatedUser.phone;
    if (customerTagNickname) customerTagNickname.textContent = updatedUser.tagNickname;

    updateMainDashboardTracking(updatedUser.tagId);

    if (profileMessage) {
      profileMessage.textContent = "Profile updated successfully.";
    }
  });
}

if (tagMessageForm) {
  tagMessageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newMessage = tagMessageInput.value.trim();

    if (!newMessage) {
      if (tagMessageStatus) tagMessageStatus.textContent = "Please enter a message.";
      return;
    }

    setTagDisplayMessage(newMessage);
    setTagDisplayMode("text");

    refreshTagDisplayUI();

    if (tagMessageStatus) {
      tagMessageStatus.textContent = "Text display updated.";
    }
  });
}

if (textModeBtn) {
  textModeBtn.addEventListener("click", function () {
    setTagDisplayMode("text");
    refreshTagDisplayUI();

    if (tagMessageStatus) {
      tagMessageStatus.textContent = "Text mode selected.";
    }
  });
}

if (imageModeBtn) {
  imageModeBtn.addEventListener("click", function () {
    const currentImage = getTagDisplayImage();

    if (!currentImage) {
      if (tagMessageStatus) {
        tagMessageStatus.textContent = "Upload an image first.";
      }
      return;
    }

    setTagDisplayMode("image");
    refreshTagDisplayUI();

    if (tagMessageStatus) {
      tagMessageStatus.textContent = "Image mode selected.";
    }
  });
}

if (tagImageInput) {
  tagImageInput.addEventListener("change", function (e) {
    const file = e.target.files && e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      if (tagMessageStatus) {
        tagMessageStatus.textContent = "Please upload an image file.";
      }
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target && event.target.result ? String(event.target.result) : "";

      if (!imageData) {
        if (tagMessageStatus) {
          tagMessageStatus.textContent = "Could not read image.";
        }
        return;
      }

      try {
        setTagDisplayImage(imageData);
        setTagDisplayMode("image");
        refreshTagDisplayUI();

        if (tagMessageStatus) {
          tagMessageStatus.textContent = "Image uploaded successfully.";
        }
      } catch (error) {
        if (tagMessageStatus) {
          tagMessageStatus.textContent = "Image is too large for browser storage. Try a smaller image.";
        }
      }
    };

    reader.readAsDataURL(file);
  });
}

if (removeTagImageBtn) {
  removeTagImageBtn.addEventListener("click", function () {
    removeTagDisplayImage();
    setTagDisplayMode("text");

    if (tagImageInput) {
      tagImageInput.value = "";
    }

    refreshTagDisplayUI();

    if (tagMessageStatus) {
      tagMessageStatus.textContent = "Uploaded image removed.";
    }
  });
}

const resetProfileBtn = document.getElementById("resetProfileBtn");

if (resetProfileBtn) {
  resetProfileBtn.addEventListener("click", function () {
    const resetUser = resetUserProfile();

    const customerName = document.getElementById("customerName");
    const profileNameDisplay = document.getElementById("profileNameDisplay");
    const customerEmail = document.getElementById("customerEmail");
    const customerPhone = document.getElementById("customerPhone");
    const customerTagNickname = document.getElementById("customerTagNickname");
    const editName = document.getElementById("editName");
    const editPhone = document.getElementById("editPhone");
    const editTagNickname = document.getElementById("editTagNickname");
    const editTagId = document.getElementById("editTagId");

    if (customerName) customerName.textContent = resetUser.name;
    if (profileNameDisplay) profileNameDisplay.textContent = resetUser.name;
    if (customerEmail) customerEmail.textContent = resetUser.email;
    if (customerPhone) customerPhone.textContent = resetUser.phone;
    if (customerTagNickname) customerTagNickname.textContent = resetUser.tagNickname;

    if (editName) editName.value = resetUser.name;
    if (editPhone) editPhone.value = resetUser.phone;
    if (editTagNickname) editTagNickname.value = resetUser.tagNickname;
    if (editTagId) editTagId.value = resetUser.tagId;

    updateMainDashboardTracking(resetUser.tagId);

    setTagDisplayMessage("Boarding Soon");
    setTagDisplayMode("text");
    removeTagDisplayImage();

    if (tagImageInput) {
      tagImageInput.value = "";
    }

    refreshTagDisplayUI();

    if (tagMessageStatus) tagMessageStatus.textContent = "";
    if (profileMessage) profileMessage.textContent = "Profile reset.";
  });
}

const otherTagForm = document.getElementById("otherTagForm");

if (otherTagForm) {
  otherTagForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const otherTagCodeInput = document.getElementById("otherTagCode");
    const otherTagMessage = document.getElementById("otherTagMessage");
    const otherTagResult = document.getElementById("otherTagResult");

    if (!otherTagCodeInput || !otherTagResult) return;

    const code = otherTagCodeInput.value.trim().toUpperCase();
    const tag = getTagData(code);

    if (!tag) {
      if (otherTagMessage) {
        otherTagMessage.textContent = "Tag not found. Try UP1001, UP1002, UP2001, or UP3001.";
      }
      otherTagResult.classList.add("hidden");
      return;
    }

    if (otherTagMessage) otherTagMessage.textContent = "";

    updateOtherTagTracking(tag);
    otherTagResult.classList.remove("hidden");
  });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    logoutUser();
    window.location.href = "login.html";
  });
}

const addToCartBtn = document.getElementById("addToCartBtn");
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", function () {
    addCurrentProductToCart();
  });
}

const buyNowBtn = document.getElementById("buyNowBtn");
if (buyNowBtn) {
  buyNowBtn.addEventListener("click", function () {
    const cart = getCart();

    if (cart.length === 0) {
      addCurrentProductToCart();
    }
  });
}

const applePayBtn = document.getElementById("applePayBtn");
const googlePayBtn = document.getElementById("googlePayBtn");
const cardCheckoutForm = document.getElementById("cardCheckoutForm");
const buyMessage = document.getElementById("buyMessage");
const clearCartBtn = document.getElementById("clearCartBtn");

if (applePayBtn) {
  applePayBtn.addEventListener("click", function () {
    if (buyMessage) {
      buyMessage.textContent = "Apple Pay is currently unavailable in this browser session.";
    }
  });
}

if (googlePayBtn) {
  googlePayBtn.addEventListener("click", function () {
    if (buyMessage) {
      buyMessage.textContent = "Google Pay is currently unavailable in this browser session.";
    }
  });
}

if (cardCheckoutForm) {
  cardCheckoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (buyMessage) {
      buyMessage.textContent = "Order submitted successfully.";
    }

    saveCart([]);
    updateCartCount();
    loadBuyPageCart();
    cardCheckoutForm.reset();
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", function () {
    saveCart([]);
    updateCartCount();
    loadBuyPageCart();

    if (buyMessage) {
      buyMessage.textContent = "Cart cleared.";
    }
  });
}

updateCartCount();
loadBuyPageCart();
setupProductGallery();