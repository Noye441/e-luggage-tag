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
    owner: "Prototype Customer",
    tagId: "UP1001",
    flight: "UA 248",
    route: "JFK → LAX",
    departure: "7:40 PM",
    status: "Boarding in 42 min",
    gate: "B12",
    baggage: "Checked In"
  },
  UP1002: {
    owner: "Sarah Khan",
    tagId: "UP1002",
    flight: "DL 517",
    route: "BUF → MIA",
    departure: "3:15 PM",
    status: "Delayed 20 min",
    gate: "A4",
    baggage: "Loaded"
  },
  UP2001: {
    owner: "Michael Lee",
    tagId: "UP2001",
    flight: "BA 178",
    route: "NYC → LON",
    departure: "10:10 PM",
    status: "Checked In",
    gate: "C9",
    baggage: "Awaiting Drop-Off"
  },
  UP3001: {
    owner: "Amina Rahman",
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

function addCurrentProductToCart() {
  const colorEl = document.getElementById("color");
  const modelEl = document.getElementById("model");
  const messageEl = document.getElementById("cartMessage");

  const color = colorEl ? colorEl.value : "Midnight Black";
  const model = modelEl ? modelEl.value : "Standard";

  const cart = getCart();
  const existing = cart.find(
    (item) => item.product === "UpTag Smart E-Luggage Tag" && item.color === color && item.model === model
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      product: "UpTag Smart E-Luggage Tag",
      color,
      model,
      price: 30.0,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();

  if (messageEl) {
    messageEl.textContent = "Added to cart successfully.";
  }
}

function formatPrice(num) {
  return `$${num.toFixed(2)}`;
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
  if (payButtonText) payButtonText.textContent = `Pay ${formatPrice(total)}`;
}

/* LOGIN */
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
      loginMessage.textContent = "Invalid email or password. Use the demo login.";
    }
  });
}

/* DASHBOARD */
const dashboardMarker = document.getElementById("customerName");

if (dashboardMarker) {
  const user = getLoggedInUser();

  if (!user) {
    window.location.href = "login.html";
  } else {
    const mainTag = getTagData(user.tagId || DEFAULT_USER.tagId);

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

    if (mainTag) {
      const dashTagId = document.getElementById("dashTagId");
      const dashFlight = document.getElementById("dashFlight");
      const dashRoute = document.getElementById("dashRoute");
      const dashDeparture = document.getElementById("dashDeparture");
      const dashStatus = document.getElementById("dashStatus");
      const dashGate = document.getElementById("dashGate");
      const dashBaggage = document.getElementById("dashBaggage");

      if (dashTagId) dashTagId.textContent = mainTag.tagId;
      if (dashFlight) dashFlight.textContent = mainTag.flight;
      if (dashRoute) dashRoute.textContent = mainTag.route;
      if (dashDeparture) dashDeparture.textContent = mainTag.departure;
      if (dashStatus) dashStatus.textContent = mainTag.status;
      if (dashGate) dashGate.textContent = mainTag.gate;
      if (dashBaggage) dashBaggage.textContent = mainTag.baggage;
    }

    const editName = document.getElementById("editName");
    const editPhone = document.getElementById("editPhone");
    const editTagNickname = document.getElementById("editTagNickname");

    if (editName) editName.value = user.name;
    if (editPhone) editPhone.value = user.phone;
    if (editTagNickname) editTagNickname.value = user.tagNickname;

    const tagDisplayPreview = document.getElementById("tagDisplayPreview");
    const tagMessageInput = document.getElementById("tagMessageInput");

    if (tagDisplayPreview) tagDisplayPreview.textContent = getTagDisplayMessage();
    if (tagMessageInput) tagMessageInput.value = getTagDisplayMessage();
  }
}

/* PROFILE UPDATE */
const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");

if (profileForm) {
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentUser = getLoggedInUser();
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      name: document.getElementById("editName").value.trim() || currentUser.name,
      phone: document.getElementById("editPhone").value.trim() || currentUser.phone,
      tagNickname: document.getElementById("editTagNickname").value.trim() || currentUser.tagNickname
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

    if (profileMessage) profileMessage.textContent = "Profile updated successfully.";
  });
}

/* TAG MESSAGE */
const tagMessageForm = document.getElementById("tagMessageForm");
const tagMessageInput = document.getElementById("tagMessageInput");
const tagDisplayPreview = document.getElementById("tagDisplayPreview");
const tagMessageStatus = document.getElementById("tagMessageStatus");

if (tagMessageForm) {
  tagMessageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newMessage = tagMessageInput.value.trim();

    if (!newMessage) {
      if (tagMessageStatus) tagMessageStatus.textContent = "Please enter a message.";
      return;
    }

    setTagDisplayMessage(newMessage);

    if (tagDisplayPreview) tagDisplayPreview.textContent = newMessage;
    if (tagMessageStatus) tagMessageStatus.textContent = "Tag display updated successfully.";
  });
}

/* RESET */
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

    if (customerName) customerName.textContent = resetUser.name;
    if (profileNameDisplay) profileNameDisplay.textContent = resetUser.name;
    if (customerEmail) customerEmail.textContent = resetUser.email;
    if (customerPhone) customerPhone.textContent = resetUser.phone;
    if (customerTagNickname) customerTagNickname.textContent = resetUser.tagNickname;

    if (editName) editName.value = resetUser.name;
    if (editPhone) editPhone.value = resetUser.phone;
    if (editTagNickname) editTagNickname.value = resetUser.tagNickname;

    setTagDisplayMessage("Boarding Soon");
    if (tagDisplayPreview) tagDisplayPreview.textContent = "Boarding Soon";
    if (tagMessageInput) tagMessageInput.value = "Boarding Soon";
    if (tagMessageStatus) tagMessageStatus.textContent = "";

    if (profileMessage) profileMessage.textContent = "Demo profile reset.";
  });
}

/* TRACK OTHER TAG */
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

    document.getElementById("otherOwner").textContent = tag.owner;
    document.getElementById("otherTagId").textContent = tag.tagId;
    document.getElementById("otherFlight").textContent = tag.flight;
    document.getElementById("otherRoute").textContent = tag.route;
    document.getElementById("otherDeparture").textContent = tag.departure;
    document.getElementById("otherStatus").textContent = tag.status;
    document.getElementById("otherGate").textContent = tag.gate;
    document.getElementById("otherBaggage").textContent = tag.baggage;

    otherTagResult.classList.remove("hidden");
  });
}

/* LOGOUT */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    logoutUser();
    window.location.href = "login.html";
  });
}

/* ADD TO CART */
const addToCartBtn = document.getElementById("addToCartBtn");
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", function () {
    addCurrentProductToCart();
  });
}

/* BUY PAGE */
const applePayBtn = document.getElementById("applePayBtn");
const googlePayBtn = document.getElementById("googlePayBtn");
const cardCheckoutForm = document.getElementById("cardCheckoutForm");
const buyMessage = document.getElementById("buyMessage");
const clearCartBtn = document.getElementById("clearCartBtn");

if (applePayBtn) {
  applePayBtn.addEventListener("click", function () {
    if (buyMessage) {
      buyMessage.textContent = "Prototype Apple Pay checkout only. Real payment integration will be added later.";
    }
  });
}

if (googlePayBtn) {
  googlePayBtn.addEventListener("click", function () {
    if (buyMessage) {
      buyMessage.textContent = "Prototype Google Pay checkout only. Real payment integration will be added later.";
    }
  });
}

if (cardCheckoutForm) {
  cardCheckoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (buyMessage) {
      buyMessage.textContent = "Prototype card payment submitted successfully.";
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
    if (buyMessage) buyMessage.textContent = "Cart cleared.";
  });
}

updateCartCount();
loadBuyPageCart();