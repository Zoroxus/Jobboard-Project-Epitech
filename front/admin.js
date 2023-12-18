//==============================================================================
//      Imports
//==============================================================================

import { getUser, fetchAPI, create_alert } from "./js/functions.js";

//==============================================================================
//      Generate table
//==============================================================================

function setTable(columns, content) {
    const table = createTable(columns, content);
    document.getElementById('table-container').innerHTML = "";
    document.getElementById('table-container').appendChild(table);
}

function createTable(columns, data) {
    const table = document.createElement('table');
    const thead = table.createTHead();
    const tbody = table.createTBody();

    // Définition du bootstrap
    table.classList.add("table")
    table.classList.add("table-hover");

    // Créez l'en-tête du tableau avec les noms des colonnes
    generateRow(thead.insertRow(), columns);

    // Crée le reste du tableau avec les valeurs

    data['data'].forEach(value => {
        generateRow(tbody.insertRow(), columns, value);
    });

    return table;
}

function generateRow(row, columns, data = null) {
    // Génère une ligne d'un tableau
    columns.forEach(columnName => {
        const th = document.createElement('th');
        th.classList.add("text-center");
        if (data == null) {
            th.textContent = columnName;
        } else {
            th.textContent = data[columnName];
        }
        row.appendChild(th);
    });
}

//==============================================================================
//      Generate select
//==============================================================================

function generateSelect(options) {
    var select = document.getElementById('table-select');
    for (const tableName in options) {
        let optn = document.createElement('option');
        optn.value = tableName;
        optn.text = tableName;
        select.add(optn, null);
    }
    return select
}

//==============================================================================
//      Generate Forms
//==============================================================================

function generateValueForForm(form, data) {
    form.querySelectorAll('input').forEach(input => {
        if (input.name != 'password') {
            input.value = data[input.name];
        }
    });
}

function generateForm(champs) {
    const formContainer = document.getElementById('formrow');
    formContainer.innerHTML = "";
    const form = document.createElement('form');
    form.setAttribute('class', 'border rounded border-3 border-primary p-2');

    champs.forEach(name => {
        if (name != "id" && name != "creation_time") {
            // on skip id et creation_time car ils sont automatiques
            form.appendChild(generateInputs(name));
        }
    });

    // On crée le boutton submit
    var submitButton = document.createElement('button');
    submitButton.setAttribute('class', 'btn btn-primary');
    submitButton.type = "submit"
    submitButton.textContent = 'Envoyer';
    form.appendChild(submitButton);

    formContainer.appendChild(form);
    return form;
}

function generateInputs(name) {
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = name + ":";

    div.setAttribute('class', 'gap-2 d-flex align-items-center m-2');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = name;
    input.required = true;
    input.classList.add("form-control");
    div.appendChild(label);
    div.appendChild(input);
    return div
}

//==============================================================================
//      Get data from API
//==============================================================================

async function getArch(token) {
    return await fetchAPI(token, 'arch');
}

//==============================================================================
//      Utils
//==============================================================================

function get_data_from_form(form) {
    let inputs = form.querySelectorAll('input');
    var result = {};
    inputs.forEach(input => {
        result[input.name] = input.value;
    });
    return result;
}

function alert_response(response) {
    if (response['Success'] == true) {
        create_alert(response['data'], 'success');
    } else {
        create_alert(response['data'], 'danger');
    }
}

async function reloadTable(token, table, arch) {
    let data = await fetchAPI(token, table);
    setTable(arch[table], data);
    document.getElementById('formrow').innerHTML = "";
    document.getElementById('id-input').value = "";
}

//==============================================================================
//      Main
//==============================================================================

async function Main() {
    var token = sessionStorage.getItem("access_token");
    var user = await getUser(token);
    if (user.admin) {
        var arch = await getArch(token);
        var select = generateSelect(arch);
        reloadTable(token, select.value, arch);

        // Les éléments commun au crud
        const formContainer = document.getElementById('formrow');
        const idinput = document.getElementById('id-input');

        // Events
        select.addEventListener('change', async function () {
            reloadTable(token, select.value, arch);
        });

        document.getElementById('crud-add').addEventListener('click', async () => {
            let form = generateForm(arch[select.value], select.value);
            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                let jsonObj = get_data_from_form(form);
                let res = await fetchAPI(token, select.value, 'POST', JSON.stringify(jsonObj));
                alert_response(res);
                reloadTable(token, select.value, arch);

            });
        });

        document.getElementById('crud-update').addEventListener('click', async () => {
            let form = generateForm(arch[select.value], select.value);
            let data = await fetchAPI(token, select.value + "/" + idinput.value);
            generateValueForForm(form, data['data']);

            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                let jsonObj = get_data_from_form(form);
                if (jsonObj['password'] != null && jsonObj['password'] != "") {
                    let change = { "new_password": jsonObj['password'], "id": idinput.value };
                    let res = await fetchAPI(token, 'change_password', 'PUT', JSON.stringify(change));
                    delete jsonObj['password'];
                }
                let res = await fetchAPI(token, select.value + "/" + idinput.value, 'PUT', JSON.stringify(jsonObj));
                alert_response(res);
                reloadTable(token, select.value, arch);

            });
        });

        document.getElementById('crud-delete').addEventListener('click', async function (event) {
            event.preventDefault();
            let res = await fetchAPI(token, select.value + "/" + idinput.value, 'DELETE');
            alert_response(res);
            reloadTable(token, select.value, arch);
        });
    } else {
        // On redirige l'utilisateur vers index.html
        var currentURL = location.href;
        location.href = currentURL.substring(0, currentURL.lastIndexOf('/')) + "/index.html";
    }
}

Main();