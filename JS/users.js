// Users Logic
let userName = document.getElementById('userName');
let userPhone = document.getElementById('userPhone');
let userRole = document.getElementById('userRole');
let submitUser = document.getElementById('submitUser');

let dataUsers = JSON.parse(localStorage.getItem('users')) || [];

let mood = 'create';
let tmp;

if (submitUser) {
    submitUser.onclick = function () {
        let newUser = {
            name: userName.value,
            phone: userPhone.value,
            role: userRole.value || 'User'
        };

        if (userName.value != '' && userPhone.value != '') {
            if (mood === 'create') {
                dataUsers.push(newUser);
            } else {
                dataUsers[tmp] = newUser;
                mood = 'create';
                submitUser.innerHTML = 'រក្សាទុកអ្នកប្រើ (Save User)';
                document.getElementById('formTitle').innerHTML = '<i class="fas fa-user-plus"></i> ទម្រង់ចុះឈ្មោះ <span>User Registration</span>';
            }
            localStorage.setItem('users', JSON.stringify(dataUsers));
            userName.value = '';
            userPhone.value = '';
            userRole.value = '';
            alert('រួចរាល់!');
        } else {
            alert('សូមបំពេញឈ្មោះ និងលេខទូរស័ព្ទ!');
        }
    }
}

function showUsers() {
    let table = '';
    dataUsers.forEach((user, i) => {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td><span class="badge">${user.role}</span></td>
            <td>
                <button onclick="updateUser(${i})" class="update-btn"><i class="fas fa-edit"></i></button>
                <button onclick="deleteUser(${i})" class="delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
        `;
    });
    let userBody = document.getElementById('userBody');
    if (userBody) userBody.innerHTML = table || '<tr><td colspan="5" style="text-align:center; padding: 40px;">មិនទាន់មានអ្នកប្រើប្រាស់ទេ</td></tr>';
}

function deleteUser(i) {
    dataUsers.splice(i, 1);
    localStorage.setItem('users', JSON.stringify(dataUsers));
    showUsers();
}

function updateUser(i) {
    if (!userName || !submitUser) {
        // We are on the List page, redirect to Add page
        localStorage.setItem('editUserIndex', i);
        location.href = 'users-add.html';
        return;
    }

    if (userName) {
        userName.value = dataUsers[i].name;
        userPhone.value = dataUsers[i].phone;
        userRole.value = dataUsers[i].role;
        submitUser.innerHTML = 'កែប្រែអ្នកប្រើ (Update User)';
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> កែប្រែព័ត៌មានអ្នកប្រើប្រាស់ <span>Edit User</span>';
        mood = 'update';
        tmp = i;
        scroll({ top: 0, behavior: 'smooth' });
    }
}

// Logic for cross-page Editing
if (localStorage.getItem('editUserIndex') !== null) {
    let i = localStorage.getItem('editUserIndex');
    localStorage.removeItem('editUserIndex');
    window.onload = function() {
        updateUser(i);
    }
}

showUsers();
