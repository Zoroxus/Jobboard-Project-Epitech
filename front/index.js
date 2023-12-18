async function get_all_ads(){
    let obj;
    const res = await fetch('/api/advertisements');
    obj = await res.json();
    return obj;
}

window.addEventListener("load", async function(event) {
    const res = await fetch('/api/advertisements');
    let obj = await res.json();
    //console.log("Récupération des offres : "+obj);     // print obj in the console for debug

    for(var i=1; i<=obj["data"].length; i++){
        //console.log(obj["data"][i-1]["users_id"]);
        const res1 = await fetch('/api/companies_by_ad/'+obj["data"][i-1]["users_id"]);
        let obj_usr = await res1.json();
        //console.log("Récupération de l'offre "+i+" : ");
        //console.log(obj["data"][i-1]);
        //try {
        //  title.innerText = obj_usr["data"]["name"];
        //}catch{
        //  title.innerText = obj_usr;
        //}
        // = = = = = = = = = = = = = = = = = = = = = = = = =
        // later : GET the users' company -- DONE
        // = = = = = = = = = = = = = = = = = = = = = = = = =
        document.getElementById("main").innerHTML += '<div class="col-md-12 col-xxl-6">'+
            '<div class="card my-3">'+
            '<div class="card-header">'+
            //'<img src="logo.png" height="16">'+
            '<span class="align-text-top">'+obj_usr["data"]["name"]+'</span>'+
            '</div><div class="card-body">'+
            '<h5 class="card-title">'+obj["data"][i-1]["name"]+'</h5>'+
            '<p id="shortDesc" class="card-text">'+obj["data"][i-1]["short_descriptions"]+'</p>'+
            '<p id="longDesc" class="card-text d-none">'+obj["data"][i-1]["descriptions"]+
                "<br>Wages : "+obj["data"][i-1]["wages"]+
                "<br>Place of work : "+obj["data"][i-1]["location"]+
                "<br>Worktime : "+obj["data"][i-1]["worktime"]+
                "<br>Creation date : "+obj["data"][i-1]["creation_time"]+
            '</p>'+
            //'<p class="card-text">'+obj["data"][i-1]["descriptions"]+'</p>'+
            '<form class="d-none" id="myForm">'+
                '<div class="input-group mb-3">'+
                    '<span class="input-group-text max" style="width: 20%;">Name</span>'+
                    '<input type="name" class="form-control" id="name" placeholder="John Doe" aria-label="Name" required>'+
                '</div>'+
                '<div class="input-group mb-3">'+
                    '<span class="input-group-text max" style="width: 20%;">Email adress</span>'+
                    '<input type="email" class="form-control" id="email" placeholder="example@gmail.com" aria-label="Email" required>'+
                '</div>'+
                '<div class="input-group mb-3">'+
                    '<span class="input-group-text max" style="width: 20%;">Phone</span>'+
                    '<input type="phone" class="form-control" id="phone" placeholder="Phone" aria-label="Phone" required>'+
                '</div>'+
                //'<label for="confirm_password" class="form-label my-1">Confirm Password</label>'+
                //'<input type="password" class="form-control my-1" id="confirm_password" placeholder="Password" required>'+
            '</form>'+
            '<div id="applyMessage" class="input-group my-2 d-none">'+
                '<span class="input-group-text max" style="width: 20%;">Message</span>'+
                '<textarea id="applyMsgArea" class="form-control" aria-label="Message"></textarea>'+
            '</div>'+
            '<a id="'+i+'" onclick="learnMore(this);" class="btn btn-primary learn">Show more</a>'+
            '<span class="px-1"></span>'+
            '<a id="apply" class="btn btn-primary d-none" onclick="applyJob(this, \'${test_str}\', '+i+');">Apply</a>'+
            '</div></div></div>';
    }
})



// ==================================================
// Lean More    =====================================
// ==================================================
async function learnMore(actual){
    card_body = actual.parentElement;
    card = card_body.parentElement;
    desc = card_body.querySelector('p');
    title = card.querySelector('span');
    msgArea = card.querySelector('#applyMessage');
    applyBtn = card.querySelector('#apply');
    shortDesc = card.querySelector('#shortDesc');
    longDesc = card.querySelector('#longDesc');
    guestForm = card.querySelector('#myForm');

    /*const res = await fetch('/api/advertisements/'+id);
    objad = await res.json();
    console.log(objad);
    desc.innerHTML = objad["data"]["descriptions"]+
    "<br>Wages : "+objad["data"]["wages"]+
    "<br>Place of work : "+objad["data"]["location"]+
    "<br>Worktime : "+objad["data"]["worktime"]+
    "<br>Creation date : "+objad["data"]["creation_time"];*/

    // If already show longDesc switch to shortDesc
    if(actual.textContent == "Show more"){
        actual.textContent = "Show less";
    }else{
        actual.textContent = "Show more";
    }

    //let code = await authConf(sessionStorage.getItem("access_token"));
    //if(code != 200){
    //    guestForm.classList.toggle("d-none");
    //}
    msgArea.classList.toggle("d-none");
    applyBtn.classList.toggle("d-none");
    shortDesc.classList.toggle("d-none");
    longDesc.classList.toggle("d-none");
}




// ==================================================
// Confirm Authentification     =====================
// ==================================================
async function authConf(token){
    try{
        const res = await fetch('/api/current_user', {  // Fetch the API
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
        //console.log("authConf Code : ", code)
        return code;
    }catch(error){
        return(error);
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

async function loadBtns(token){
    try{
        let code = await authConf(token);
        console.log("Code : ", code);
        if(code != 200){
            loginBtn.classList.remove("d-none");
            accountBtn.classList.remove("d-none");
            return;
        }
        decoBtn.classList.remove("d-none");
        mdfBtn.classList.remove("d-none");
    }catch(error){
        console.log("Erreur : ", error);
    }
}
loadBtns(sessionStorage.getItem("access_token"));

// ==================================================
// Apply to an Offer    =============================
// ==================================================
async function applyJob(element, message, jobId){
    try{
        card_body = element.parentElement;
        card = card_body.parentElement;
        desc = card_body.querySelector('p');
        title = card.querySelector('span');
        msgArea = card.querySelector('#applyMsgArea');
        let token = sessionStorage.getItem("access_token");
        let code = await authConf(token);
        //console.log("Code authentification : ", code);

        // Get the old alert
        const oldAlert = document.getElementById('oldAlert');

        if(code != 200){
            if(oldAlert){
                oldAlert.remove();
            }
            card_body.innerHTML +=
            '<div id="oldAlert" class="alert alert-danger alert-dismissible mt-2" role="alert">'+
            '   <div>You must be connected to apply !</div>'+
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
            '</div>';
            return 0;
        }else{
            // Get user info
            const res = await fetch('/api/current_user', {  // Fetch the API
                method: 'GET',     // GET
                headers: {
                  'Authorization': 'Bearer '+token         // Token for Auth
                }
            });
            let obj = await res.json();

            //Create the jsonObj for the API
            var jsonObj = {"message": msgArea.value, "users_id": obj["id"], "advertisements_id": jobId};
            //console.log("POST Body : ", jsonObj);

            // Post an application
            let resPost = await fetch('/api/applications', {  // Fetch the API
                method: 'POST',     // POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(jsonObj)         // Sending the jsonObj
            });

            // return error if code not 200
            if (!resPost?.ok){
                if(oldAlert){
                    oldAlert.remove();
                }
                card_body.innerHTML +=
                '<div id="oldAlert" class="alert alert-danger alert-dismissible mt-2" role="alert">'+
                '   <div>Error '+resPost.status+' : '+resPost.statusText+'.</div>'+
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
                '</div>';
                throw new TypeError("Error "+resPost.status+" : "+resPost.statusText);
            }

            let msg = await resPost.text();   // Get the message from the API
            console.log(msg);             // Print it in the console
            if(oldAlert){
                oldAlert.remove();
            }
            card_body.innerHTML +=
            '<div id="oldAlert" class="alert alert-success alert-dismissible mt-2" role="alert">'+
            '   <div>Successfuly applied to '+card_body.querySelector('h5').textContent+' !</div>'+
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
            '</div>';
        }
    }
    catch(error){
        console.log("Erreur : ", error);
        return error;
    }
}