// ==================================================
// On Load  =========================================
// ==================================================
form = document.getElementById('myForm')
emailInput = form.querySelector('#email');
passInput = form.querySelector('#password');
cpassInput = form.querySelector('#confirm_password');
fnameInput = form.querySelector('#firstname');
lnameInput = form.querySelector('#lastname');
phoneInput = form.querySelector('#phone');
adressInput = form.querySelector('#adress');
birthInput = form.querySelector('#birthdate');
submit = form.querySelector('#submit');
// Get the token for all API access
token = sessionStorage.getItem("access_token");

window.addEventListener("load", async function(event) {

    // If not connected go to index.html
    //if(authConf != true){
    //    location.href = location.href.substring(0, location.href.lastIndexOf('/')) + "/index.html";
    //}

    // Auto fill form with user info
    let userInfo = await getUser();
    emailInput.value = userInfo["email"];
    fnameInput.value = userInfo["firstname"];
    lnameInput.value = userInfo["name"];
    phoneInput.value = userInfo["phone"];
    adressInput.value = userInfo["adress"];
    birthInput.value = userInfo["birthdate"];
})

submit.addEventListener("mouseover", async function(event) {
    console.log('Birthdate : '+birthInput.value);
})


// ==================================================
// Confirm Authentification     =====================
// ==================================================
async function authConf(){
    try{
        //let token = sessionStorage.getItem("access_token")
        const res = await fetch('/api/curent_users', {  // Fetch the API
            method: 'GET',     // GET
            headers: {
              'Authorization': 'Bearer '+token         // Token for Auth
            }
        });
        let code = res.status;
        if(!res?.ok){
            if(sessionStorage.getItem("session_token") || sessionStorage.getItem("email")){
                unSign();
            }
            throw new TypeError("Error : " + res.status + " : " + res.statusText);
        }
        console.log("The user is connected !")
        return true;
    }catch(error){
        return error;
    }
}



// ==================================================
// Disconnect button        =========================
// ==================================================
function unSign(){
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("email");
    //console.log("Access Token : ", sessionStorage.getItem("access_token"));
    location.reload();
}

const userBtn = document.getElementById('userBtn');
const decoBtn = document.getElementById('decoBtn');
const loginBtn = document.getElementById('loginBtn');
const accountBtn = document.getElementById('signupBtn');
const mdfBtn = document.getElementById('mdfBtn');

async function loadBtns(){
    try{
        if(!authConf()){
            loginBtn.classList.remove("d-none");
            accountBtn.classList.remove("d-none");
            return;
        }
        decoBtn.classList.remove("d-none");
    }catch(error){
        console.log("Erreur : ", error);
    }
}
loadBtns(sessionStorage.getItem("access_token"));



// ==================================================
// Get User Info    =================================
// ==================================================
async function getUser(){
    try{
        const res = await fetch('/api/curent_users', {  // Fetch the API
            method: 'GET',     // GET
            headers: {
              'Authorization': 'Bearer '+token         // Token for Auth
            }
        });
        let obj = res.json();
        if(!res?.ok){
            throw new TypeError("Error : " + res.status + " : " + res.statusText);
        }
        return obj;
    }catch(error){
        console.log("getUser() error !");
        return error;
    }
}


// ==================================================
// Update User  =====================================
// ==================================================
async function updateUser(){
    try{
        let userInfo = await getUser();
        if(userInfo["companies_id"]<1){ companyId=null }else{ companyId=userInfo["companies_id"] }
        if(passInput.value==""){
            var jsonObj = {'email': emailInput.value,
            'admin': userInfo["admin"], 
            'companies_id': companyId,
            "firstname": fnameInput.value,
            "name": lnameInput.value,
            "birthdate": birthInput.value,
            "phone": phoneInput.value,
            "adress": adressInput.value};    //Create the jsonObj for the API
        }else{
            if(passInput.value == cpassInput.value){
                var jsonObj = {'email': emailInput.value,
                "password": passInput.value,
                'admin': userInfo["admin"], 
                'companies_id': companyId,
                "firstname": fnameInput.value,
                "name": lnameInput.value,
                "birthdate": birthInput.value,
                "phone": phoneInput.value,
                "adress": adressInput.value};    //Create the jsonObj for the API
            }else{
                card_body.innerHTML +=
                '<div id="oldAlert" class="alert alert-success alert-dismissible mt-2" role="alert">'+
                '   <div>Confirm Password must be equal to Password !</div>'+
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
                '</div>';
            }
        }
        

        const res = await fetch('/api/user/'+userInfo["id"], {  // Fetch the API
            method: 'PUT',     // PUT
            headers: {
                'Content-Type': 'application/json',     // Set content type to JSON
                'Authorization': 'Bearer '+token        // Token for Auth
            },
            body: JSON.stringify(jsonObj)         // Send the jsonObj
        });
        let obj = res.json();
        if(!res?.ok){
            throw new TypeError("Error : " + res.status + " : " + res.statusText);
        }
        return obj;
    }catch(error){
        console.log("getUser() error !");
        return(error);
    }
}