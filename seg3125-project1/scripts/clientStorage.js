function storeSchedulingInfo(date, time, name, email, climbingType, renting) {
  let schedulingInfo = JSON.stringify({
    date: date,
    time: time,
    name: name,
    email: email,
    climbingType: climbingType,
    renting: renting // BUG: this key-value pair is NOT being stored in the local storage
  });
  localStorage.setItem("schedulingInfo", btoa(schedulingInfo)); // storing the base64 encoded schedulingInfo object in local storage
}

function storeGuide(name) {
  localStorage.setItem("guideName", name);
}

function storeRental(itemName, itemPrice) { // appends a rental object to the local storage
  let cart = localStorage.getItem("rentals");
  if (cart)
    cart = JSON.parse(atob(cart));
  else
    cart = [];
  
  cart.push({
    itemName: itemName,
    itemPrice: itemPrice
  });
  localStorage.setItem("rentals", btoa(JSON.stringify(cart))); // storing the base64 encoded rentals list in local storage
}

function storePaymentInfo(cardholderName, cardNumber, expDate, cvv) {
  let paymentInfo = JSON.stringify({
    cardholderName: cardholderName,
    cardNumber: cardNumber,
    expDate: expDate,
    cvv: cvv
  });
  localStorage.setItem("paymentInfo", btoa(paymentInfo));
}

function getSchedulingInfo() {
  return JSON.parse(atob(localStorage.getItem("schedulingInfo")));
}

function getAllSessionData() {
  let data = {
    'schedulingInfo': JSON.parse(atob(localStorage.getItem("schedulingInfo"))),
    'guide': localStorage.getItem("guideName"),
    'rentals': JSON.parse(atob(localStorage.getItem("rentals")))
  };

  if (localStorage.getItem("paymentInfo"))
    data['paymentInfo'] = JSON.parse(atob(localStorage.getItem("paymentInfo")));

  return data;
}