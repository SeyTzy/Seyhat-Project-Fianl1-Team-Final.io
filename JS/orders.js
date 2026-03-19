// Orders Logic
let orderCustomer = document.getElementById('orderCustomer');
let orderProduct = document.getElementById('orderProduct');
let orderQty = document.getElementById('orderQty');
let submitOrder = document.getElementById('submitOrder');

let dataOrders = JSON.parse(localStorage.getItem('orders')) || [];

let mood = 'create';
let tmp;

if (submitOrder) {
    submitOrder.onclick = function () {
        let newOrder = {
            customer: orderCustomer.value,
            product: orderProduct.value,
            qty: orderQty.value || 1,
            date: new Date().toLocaleDateString()
        };

        if (orderCustomer.value != '' && orderProduct.value != '') {
            if (mood === 'create') {
                dataOrders.push(newOrder);
            } else {
                dataOrders[tmp] = newOrder;
                mood = 'create';
                submitOrder.innerHTML = 'បង្កើតការកម្ម៉ង់ (Create Order)';
            }
            localStorage.setItem('orders', JSON.stringify(dataOrders));
            orderCustomer.value = '';
            orderProduct.value = '';
            orderQty.value = '';
            alert('រួចរាល់!');
        } else {
            alert('សូមបំពេញព័ត៌មានអតិថិជន និងទំនិញ!');
        }
    }
}

function showOrders() {
    let table = '';
    dataOrders.forEach((order, i) => {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.qty}</td>
            <td style="font-weight:700; color:var(--primary)">Processing...</td>
            <td>${order.date}</td>
            <td>
                <button onclick="updateOrder(${i})" class="update-btn"><i class="fas fa-edit"></i></button>
                <button onclick="deleteOrder(${i})" class="delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
        `;
    });
    let orderBody = document.getElementById('orderBody');
    if (orderBody) orderBody.innerHTML = table || '<tr><td colspan="7" style="text-align:center; padding: 40px;">មិនទាន់មានការកម្ម៉ង់ទេ</td></tr>';
}

function deleteOrder(i) {
    dataOrders.splice(i, 1);
    localStorage.setItem('orders', JSON.stringify(dataOrders));
    showOrders();
}

function updateOrder(i) {
    if (!orderCustomer || !submitOrder) {
        // We are on the List page, redirect to Add page
        localStorage.setItem('editOrderIndex', i);
        location.href = 'orders-add.html';
        return;
    }

    if (orderCustomer) {
        orderCustomer.value = dataOrders[i].customer;
        orderProduct.value = dataOrders[i].product;
        orderQty.value = dataOrders[i].qty;
        submitOrder.innerHTML = 'កែប្រែការកម្ម៉ង់ (Update Order)';
        mood = 'update';
        tmp = i;
        scroll({ top: 0, behavior: 'smooth' });
    }
}

// Logic for cross-page Editing
if (localStorage.getItem('editOrderIndex') !== null) {
    let i = localStorage.getItem('editOrderIndex');
    localStorage.removeItem('editOrderIndex');
    window.onload = function() {
        updateOrder(i);
    }
}

showOrders();
