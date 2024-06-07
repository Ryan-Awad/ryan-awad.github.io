function displaySessionData(session) {
  document.getElementById("guideName").value = "$50.00 — " + session['guide'];

  let rentalsDiv = document.getElementById("rentals");
  let currRental;
  if (session['schedulingInfo']['renting']) {
    let rentalsHeader = document.createElement("label");
    rentalsHeader.innerHTML = "Rental Equipment";
    rentalsDiv.appendChild(rentalsHeader);

    for (let i = 0; i < session['rentals'].length; i++) {
      currRental = document.createElement("input");
      currRental.type = 'text';
      currRental.className = 'form-control'
      currRental.value = "$" + session['rentals'][i]['itemPrice'] + " — " + session['rentals'][i]['itemName'];
      currRental.disabled = true;
      rentalsDiv.appendChild(currRental);
    }
  }

  // calculating the total price
  let total = 50.0; // starts with flat $50.00 fee for guide
  if (session['schedulingInfo']['renting']) {
    for (let i = 0; i < session['rentals'].length; i++) {
      total += session['rentals'][i]['itemPrice'];
    }
  }
  total *= 1.13; // includes taxes
  total = Math.round(total * 100) / 100;

  document.getElementById("totalPrice").innerHTML += "$" + total;
}