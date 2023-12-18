//Here we declare all functions to interact with the api


function hash_string(str) {
  return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
    return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
  });
}


// ==================================================
// Sign Up as the user with email and password
// ==================================================
async function signUp(email, password, firstname, name, birth, phone, adress) {
  //password confirmed outside the function
  //var password_hash = await hash_string(password);    // Hash the password
  var jsonObj = {
    'email': email,
    'password': password,
    'admin': false,
    'companies_id': null,
    "firstname": firstname,
    "name": name,
    "birthdate": birth,
    "phone": phone,
    "adress": adress
  };;    //Create the jsonObj for the API

  let res = await fetch('/api/signup', {  // Fetch the API at /api/signup
    method: 'POST',                       // POST
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonObj)         // Sending the jsonObj
  });
  let msg = await res.text();   // Get the message fro mthe API
  console.log(msg);             // Print it in the console
}



// ==================================================
// Get User Info    =================================
// ==================================================
async function getUser(token) {
  try {
    const res = await fetch('/api/current_user', {  // Fetch the API
      method: 'GET',     // GET
      headers: {
        'Authorization': 'Bearer ' + token         // Token for Auth
      }
    });
    let obj = res.json();
    if (!res?.ok) {
      throw new TypeError("Error : " + res.status + " : " + res.statusText);
    }
    return obj;
  } catch (error) {
    console.log("getUser() error !");
    return error;
  }
}



// ==================================================
// Sign In as the user with email and password
// ==================================================
async function signIn(email, password) {
  //password confirmed outside the function
  var password_hash = await hash_string(password);    // Hash the password
  var jsonObj = { 'username': email, 'password': password_hash };    //Create the jsonObj for the API

  // url parameters for application/x-www-form-urlencoded
  let urlParam = "grant_type=&username=" + email + "&password=" + password + "&scope=&client_id=&client_secret=";

  let res = await fetch('/api/login', {  // Fetch the API at /api/signup
    method: 'POST',                       // POST
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: urlParam         // Sending urlParam
  });
  let msg = await res.json();   // Get the message from the API
  console.log(msg);             // Print it in the console
  sessionStorage.setItem("access_token", msg["access_token"]);
  sessionStorage.setItem("email", email);

  let userInfo = await getUser(msg["access_token"])
  if (userInfo["admin"] == true) {
    var currentURL = location.href;
    console.log("Admin detected !");
    location.href = currentURL.substring(0, currentURL.lastIndexOf('/')) + "/admin.html";
  } else {
    var currentURL = location.href;
    console.log("Non-Admin detected !");
    location.href = currentURL.substring(0, currentURL.lastIndexOf('/')) + "/index.html";
  }
}

// ==================================================
// Get data from api
// ==================================================

async function fetchAPI(token, route, method = 'GET', body = "") {
  var requestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: body
  }

  if (body == "" && method == 'GET') {
    // On suppr le body si vide
    delete requestOptions['body'];
  }
  try {
    const response = await fetch('/api/' + route, requestOptions);

    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut de réponse : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Une erreur s\'est produite :', error.message);
  }
}

// ==================================================
// UnSing user (disconnect button)
// ==================================================

export function unSign() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("email");
  location.reload();
}

function create_alert(message, type, id = "alerts") {
  // On vide la container d'alerte
  const alertcontainer = document.getElementById(id);
  alertcontainer.innerHTML = "";

  // On crée l'alerte
  var alert = document.createElement('div');
  alert.setAttribute('class', 'alert alert-' + type + ' alert-dismissible');
  alert.textContent = message;

  // On ajoute le boutton de fermeture
  var btn = document.createElement('button');
  btn.setAttribute('class', 'btn-close');
  btn.setAttribute('data-bs-dismiss', 'alert');
  btn.setAttribute('aria-label', 'Close');
  alert.appendChild(btn);
  alertcontainer.appendChild(alert);
}

export { signUp, signIn, getUser, fetchAPI, create_alert };