// Data aggregation for Categories
function loadCategories() {
    let dataPro = JSON.parse(localStorage.getItem('product')) || [];
    let categoriesMap = {};

    // Aggregate data
    dataPro.forEach(pro => {
        let cat = pro.category.toLowerCase().trim();
        if (!categoriesMap[cat]) {
            categoriesMap[cat] = {
                name: pro.category,
                count: 0, // This will store total Qty
                totalValue: 0
            };
        }
        // Sum the actual quantity of each product entry
        categoriesMap[cat].count += (+pro.count || 1);
        categoriesMap[cat].totalValue += (+pro.total || 0);
    });

    let catArray = Object.values(categoriesMap);
    renderTable(catArray);
    updateStats(catArray, dataPro.length);
}

function renderTable(categories) {
    let table = '';
    categories.forEach((cat, i) => {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td><span class="badge" style="font-size: 1rem; padding: 8px 16px;">${cat.name}</span></td>
            <td>${cat.count}</td>
            <td style="font-weight: 700; color: var(--primary)">$${cat.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>
                <button onclick="editCategory('${cat.name.replace(/'/g, "\\'")}')" class="update-btn" title="កែប្រែប្រភេទ"><i class="fas fa-edit"></i></button>
                <button onclick="deleteCategory('${cat.name.replace(/'/g, "\\'")}')" class="delete-btn" title="លុបប្រភេទ"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
        `;
    });

    document.getElementById('categoryBody').innerHTML = table || '<tr><td colspan="5" style="text-align:center; padding: 40px;">មិនទាន់មានទិន្នន័យនៅឡើយទេ</td></tr>';
}

function editCategory(catName) {
    localStorage.setItem('editCategoryName', catName);
    location.href = 'categories-add.html';
}

function deleteCategory(catName) {
    if (confirm(`តើអ្នកពិតជាចង់លុបទំនិញទាំងអស់ក្នុងប្រភេទ "${catName}" មែនទេ?`)) {
        let dataPro = JSON.parse(localStorage.getItem('product')) || [];
        dataPro = dataPro.filter(pro => pro.category.toLowerCase().trim() !== catName.toLowerCase().trim());
        localStorage.setItem('product', JSON.stringify(dataPro));
        loadCategories();
    }
}

function updateStats(categories, totalItems) {
    document.getElementById('statTotalCategories').innerHTML = categories.length;
    document.getElementById('statTotalItems').innerHTML = totalItems;
}

// Initial call
loadCategories();
