// Customer Management Logic
let custName = document.getElementById('custName');
let custPhone = document.getElementById('custPhone');
let custEmail = document.getElementById('custEmail');
let submitCust = document.getElementById('submitCust');
let formTitle = document.getElementById('formTitle');

let mood = 'create';
let tmp;

let dataCust = JSON.parse(localStorage.getItem('customers')) || [];

submitCust.onclick = function () {
    let newCust = {
        name: custName.value,
        phone: custPhone.value,
        email: custEmail.value || 'N/A'
    };

    if (custName.value != '' && custPhone.value != '') {
        if (mood === 'create') {
            dataCust.push(newCust);
        } else {
            dataCust[tmp] = newCust;
            mood = 'create';
            submitCust.innerHTML = 'រក្សាទុកព័ត៌មាន (Save Customer)';
            formTitle.innerHTML = '<i class="fas fa-user-plus"></i> បញ្ចូលអតិថិជនថ្មី (New Customer)';
        }
        localStorage.setItem('customers', JSON.stringify(dataCust));
        clearInputs();
        showCustomers();
    } else {
        alert('សូមបំពេញឈ្មោះ និងលេខទូរស័ព្ទ!');
    }
}

function clearInputs() {
    custName.value = '';
    custPhone.value = '';
    custEmail.value = '';
}

function showCustomers(filterValue = '') {
    let table = '';
    dataCust.forEach((cust, i) => {
        if (filterValue === '' || cust.name.toLowerCase().includes(filterValue.toLowerCase()) || cust.phone.includes(filterValue)) {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${cust.name}</td>
                <td>${cust.phone}</td>
                <td>${cust.email}</td>
                <td>
                    <button onclick="editCustomer(${i})" class="update-btn"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteCustomer(${i})" class="delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
            `;
        }
    });
    document.getElementById('custBody').innerHTML = table || '<tr><td colspan="5" style="text-align:center; padding: 40px;">មិនទាន់មានអតិថិជនទេ</td></tr>';
}

function editCustomer(i) {
    custName.value = dataCust[i].name;
    custPhone.value = dataCust[i].phone;
    custEmail.value = dataCust[i].email === 'N/A' ? '' : dataCust[i].email;

    mood = 'update';
    tmp = i;
    submitCust.innerHTML = 'កែប្រែព័ត៌មាន (Update Customer)';
    formTitle.innerHTML = '<i class="fas fa-user-pen"></i> កែប្រែព័ត៌មានអតិថិជន (Edit Customer)';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteCustomer(i) {
    if (confirm('តើអ្នកចង់លុបអតិថិជននេះមែនទេ?')) {
        dataCust.splice(i, 1);
        localStorage.setItem('customers', JSON.stringify(dataCust));
        showCustomers();
    }
}

function searchCustomer(val) {
    showCustomers(val);
}

// Initial Call
showCustomers();
