// Categories Add/Edit Logic
let catName = document.getElementById('catName');
let catDesc = document.getElementById('catDesc');
let submitCat = document.getElementById('submitCat');
let formTitle = document.getElementById('formTitle');

let mood = 'create';
let tmpName;

let dataCats = JSON.parse(localStorage.getItem('categories')) || [];

if (submitCat) {
    submitCat.onclick = function () {
        let newCat = {
            name: catName.value,
            desc: catDesc.value || ''
        };

        if (catName.value != '') {
            if (mood === 'create') {
                // Check if exists
                let exists = dataCats.some(c => c.name.toLowerCase() === newCat.name.toLowerCase());
                if (!exists) {
                    dataCats.push(newCat);
                } else {
                    alert('ប្រភេទនេះមានរួចហើយ!');
                    return;
                }
            } else {
                // Update
                let index = dataCats.findIndex(c => c.name === tmpName);
                if (index != -1) {
                    dataCats[index] = newCat;
                } else {
                    dataCats.push(newCat);
                }
                mood = 'create';
                submitCat.innerHTML = 'រក្សាទុកប្រភេទ (Save Category)';
                formTitle.innerHTML = '<i class="fas fa-tags"></i> បង្កើតប្រភេទថ្មី <span>New Category</span>';
            }
            localStorage.setItem('categories', JSON.stringify(dataCats));
            catName.value = '';
            catDesc.value = '';
            alert('រួចរាល់!');
        } else {
            alert('សូមបំពេញឈ្មោះប្រភេទ!');
        }
    }
}

// Logic for cross-page Editing
if (localStorage.getItem('editCategoryName') !== null) {
    let name = localStorage.getItem('editCategoryName');
    localStorage.removeItem('editCategoryName');
    
    window.onload = function() {
        let cat = dataCats.find(c => c.name === name);
        if (cat) {
            catName.value = cat.name;
            catDesc.value = cat.desc;
        } else {
            catName.value = name;
        }
        
        submitCat.innerHTML = 'កែប្រែប្រភេទ (Update Category)';
        formTitle.innerHTML = '<i class="fas fa-edit"></i> កែប្រែព័ត៌មានប្រភេទ <span>Edit Category</span>';
        mood = 'update';
        tmpName = name;
    }
}
