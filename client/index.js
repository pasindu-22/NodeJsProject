document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

});

// Event Listner for the table. 
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

// Event Listner for the add button
const addBtn = document.getElementById('add-name-btn');
addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const cityInput = document.querySelector('#city-input');
    const phoneInput = document.querySelector('#phone-input');
    const name = nameInput.value;
    const city = cityInput.value;
    const phone = phoneInput.value;
    nameInput.value = "";
    cityInput.value = "";
    phoneInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            name: name,
            city: city,
            phone: phone
        })
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}


 
// Delete Row by ID
function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE' 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();         // Reload the page
        }
    });
}


// Edit Row by ID
function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row'); // Present our hidden edit menu.
    updateSection.hidden = false;
    const updateBtn = document.querySelector('#update-row-btn');
    document.querySelector('#update-row-btn').dataset.id = id;
}

const updateBtn = document.querySelector('#update-row-btn'); 

updateBtn.onclick = function() {    // Update event listner
    const updateNameInput = document.querySelector('#update-name-input');
    const id = updateBtn.dataset.id;

    console.log(updateNameInput);
    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }  else {
            console.error('Update failed');
        }
    })
    .catch(error => console.error('Error:', error)); 
}


// Search Button
const searchBtn = document.querySelector('#search-btn');

// Search Event Listner
searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Insert Row into the table
function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('no-data');
    
    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key==='dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;



    tableHtml += "</tr>";

    if(isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

 
// Load Data to HTML Table
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";
    data.forEach(function ({id, name,city,phone, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${city}</td>`;
        tableHtml += `<td>${phone}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += "</tr>";

    });
    table.innerHTML = tableHtml;
}