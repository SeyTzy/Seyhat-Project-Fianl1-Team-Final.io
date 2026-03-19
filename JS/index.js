// DOM Elements
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let formTitle = document.getElementById('formTitle');
let countGroup = document.getElementById('countGroup');

// Stats Elements
let statTotalProducts = document.getElementById('statTotalProducts');
let statTotalValue = document.getElementById('statTotalValue');
let statTotalCategories = document.getElementById('statTotalCategories');
let statAvgPrice = document.getElementById('statAvgPrice');

let mood = 'create';
let tmp;

// 1. get total (Strict Tutorial Logic)
function getTotal() {
    if (price && price.value != '') {
        let countVal = (count && count.value > 0) ? +count.value : 1;
        let result = ((+price.value + +taxes.value + +ads.value) - +discount.value) * countVal;
        if (total) total.innerHTML = result.toFixed(2);

        // Modern SaaS feedback: Add success class
        let preview = document.querySelector('.price-preview');
        if (preview) preview.classList.add('success');
    } else {
        if (total) total.innerHTML = '0';
        let preview = document.querySelector('.price-preview');
        if (preview) preview.classList.remove('success');
    }
}

// 2. Load Data
let dataPro;
if (localStorage.getItem('product') != null) {
    dataPro = JSON.parse(localStorage.getItem('product'));
} else {
    dataPro = [];
}

// 3. Create & Update logic (Strict Tutorial Match for Count)
if (submit) {
    submit.onclick = function () {
        let newPro = {
            title: title.value.toLowerCase(),
            price: price.value,
            taxes: taxes.value,
            ads: ads.value,
            discount: discount.value,
            total: total ? total.innerHTML : '0',
            count: (count ? count.value : 1) || 1,
            category: category.value.toLowerCase(),
        }

        // Validation
        if (title.value != '' && price.value != '' && category.value != '' && newPro.count < 1000) {
            if (mood === 'create') {
                dataPro.push(newPro);
            } else {
                dataPro[tmp] = newPro;
                mood = 'create';
                submit.innerHTML = 'រក្សាទុកទិន្នន័យ (Save Data)';
                if (formTitle) formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> បញ្ចូលទិន្នន័យថ្មី (Create Product)';
            }

            // save localstorage
            localStorage.setItem('product', JSON.stringify(dataPro));

            clearData();
            showData();
            updateStats();
        } else {
            alert('សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់ (ឈ្មោះ តម្លៃ និងប្រភេទ)!');
        }
    }
}

// 4. Clear Data
function clearData() {
    if (title) title.value = '';
    if (price) price.value = '';
    if (taxes) taxes.value = '';
    if (ads) ads.value = '';
    if (discount) discount.value = '';
    if (total) total.innerHTML = '0';
    if (count) count.value = '';
    if (category) category.value = '';
    getTotal();
}

// 5. Read (Render Table)
function showData() {
    let tbody = document.getElementById('tbody');
    if (!tbody) return;

    // Detect if we are on Dashboard or List Page
    let isDashboard = document.title.includes("Dashboard");
    let table = '';

    for (let i = 0; i < dataPro.length; i++) {
        if (isDashboard) {
            // Summary view (4 columns)
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td style="font-weight: 700; color: var(--primary)">$${dataPro[i].total}</td>
                <td><span class="badge">${dataPro[i].category}</span></td>
            </tr>
            `;
        } else {
            // Detailed view (7 columns)
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>$${dataPro[i].price}</td>
                <td>${dataPro[i].count}</td>
                <td style="font-weight: 700; color: var(--primary)">$${dataPro[i].total}</td>
                <td><span class="badge">${dataPro[i].category}</span></td>
                <td>
                    <button onclick="updateData(${i})" class="update-btn" title="កែប្រែ"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteData(${i})" class="delete-btn" title="លុប"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
            `;
        }
    }
    tbody.innerHTML = table || (isDashboard ? '<tr><td colspan="4" style="text-align:center; padding: 20px;">មិនមានទិន្នន័យ</td></tr>' : '<tr><td colspan="7" style="text-align:center; padding: 40px;">មិនមានទិន្នន័យ</td></tr>');

    let btnDelete = document.getElementById('deleteAll');
    if (btnDelete && !isDashboard) {
        if (dataPro.length > 0) {
            btnDelete.innerHTML = `
            <button onclick="deleteAll()" class="btn-danger-outline"><i class="fas fa-trash-sweep"></i> លុបទិន្នន័យទាំងអស់ (${dataPro.length})</button>
            `
        } else {
            btnDelete.innerHTML = '';
        }
    }
}

// 6. Update Stats
function updateStats() {
    if (statTotalProducts) statTotalProducts.innerHTML = dataPro.length;

    let totalValue = dataPro.reduce((acc, curr) => acc + +curr.total, 0);
    if (statTotalValue) statTotalValue.innerHTML = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let categories = [...new Set(dataPro.map(item => item.category))];
    if (statTotalCategories) statTotalCategories.innerHTML = categories.length;

    let avgPrice = dataPro.length > 0 ? (totalValue / dataPro.length) : 0;
    if (statAvgPrice) statAvgPrice.innerHTML = '$' + avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 7. Delete (Tutorial Logic)
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
    updateStats();
}

// 8. Delete All (Tutorial Logic)
function deleteAll() {
    localStorage.removeItem('product');
    dataPro.splice(0);
    showData();
    updateStats();
}

// 9. Update
function updateData(i) {
    if (!title || !submit) {
        // We are on the List page, redirect to Add page
        localStorage.setItem('editIndex', i);
        location.href = 'products-add.html';
        return;
    }

    if (title) title.value = dataPro[i].title;
    if (price) price.value = dataPro[i].price;
    if (taxes) taxes.value = dataPro[i].taxes;
    if (ads) ads.value = dataPro[i].ads;
    if (discount) discount.value = dataPro[i].discount;
    if (category) category.value = dataPro[i].category;
    if (count) count.value = dataPro[i].count;
    getTotal();

    if (formTitle) formTitle.innerHTML = '<i class="fas fa-edit"></i> កែប្រែទិន្នន័យ (Update Product)';
    if (submit) submit.innerHTML = 'កែប្រែទិន្នន័យ (Update Data)';
    mood = 'update';
    tmp = i;

    scroll({
        top: 200,
        behavior: 'smooth',
    });
}

// Logic for cross-page Editing
if (localStorage.getItem('editIndex') !== null) {
    let i = localStorage.getItem('editIndex');
    localStorage.removeItem('editIndex'); // Clear it so it doesn't loop
    // Wait for DOM and variables to be ready
    window.onload = function() {
        updateData(i);
    }
}

// Add event listener for count if it exists
if (count) {
    count.onkeyup = getTotal;
}

// 10. Search (Tutorial Toggle Logic)
let searchMode = 'title';

function getSearchMode(id) {
    let search = document.getElementById('search');
    let titleBtn = document.getElementById('searchTitle');
    let categoryBtn = document.getElementById('searchCategory');

    if (id == 'searchTitle') {
        searchMode = 'title';
        if (titleBtn) titleBtn.classList.add('active');
        if (categoryBtn) categoryBtn.classList.remove('active');
    } else {
        searchMode = 'category';
        if (categoryBtn) categoryBtn.classList.add('active');
        if (titleBtn) titleBtn.classList.remove('active');
    }
    if (search) {
        search.placeholder = 'ស្វែងរកតាម ' + (searchMode === 'title' ? 'ឈ្មោះ' : 'ប្រភេទ') + '...';
        search.focus();
        search.value = '';
    }
    showData();
}

function searchData(value) {
    let tbody = document.getElementById('tbody');
    if (!tbody) return;

    let table = '';
    let found = false;
    for (let i = 0; i < dataPro.length; i++) {
        let match = false;
        if (searchMode == 'title') {
            if (dataPro[i].title.includes(value.toLowerCase())) {
                match = true;
            }
        } else {
            if (dataPro[i].category.includes(value.toLowerCase())) {
                match = true;
            }
        }

        if (match) {
            found = true;
            table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>$${dataPro[i].price}</td>
                    <td>$${dataPro[i].taxes}</td>
                    <td>$${dataPro[i].ads}</td>
                    <td>$${dataPro[i].discount}</td>
                    <td style="font-weight: 700; color: var(--primary)">$${dataPro[i].total}</td>
                    <td><span class="badge">${dataPro[i].category}</span></td>
                    <td>
                        <button onclick="updateData(${i})" class="update-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteData(${i})" class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
                `;
        }
    }

    if (!found && value != '') {
        table = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: var(--text-dim)">មិនមានទិន្នន័យ " ${value} " ទេ!</td></tr>`;
    }

    tbody.innerHTML = table;
}

// Initial calls
showData();
updateStats();
