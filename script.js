document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;

    const item = { name, category };

    if (id) {
        updateItem(id, item);
    } else {
        addItem(item);
    }

    document.getElementById('itemForm').reset();
});

document.getElementById('categoryFilter').addEventListener('change', fetchItems);

function fetchItems() {
    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then(data => {
            const selectedCategory = document.getElementById('categoryFilter').value;
            const filteredItems = selectedCategory ? data.filter(item => item.category === selectedCategory) : data;
            renderItems(filteredItems);
        });
}

function renderItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} (${item.category}) 
                        <button onclick="deleteItem(${item.id})">Delete</button>
                        <button onclick="editItem(${item.id}, '${item.name}', '${item.category}')">Edit</button>`;
        itemList.appendChild(li);
    });
}

function editItem(id, name, category) {
    document.getElementById('itemId').value = id;
    document.getElementById('itemName').value = name;
    document.getElementById('itemCategory').value = category;
}

function addItem(item) {
    fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    }).then(fetchItems);
}

function updateItem(id, updatedItem) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    }).then(fetchItems);
}

function deleteItem(id) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
    }).then(fetchItems);
}

fetchItems();
