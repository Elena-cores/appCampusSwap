//perfil
function mostrarProductos(tipo) {
    fetch(`/perfil/${tipo}`)
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; 
            if (data.length > 0) {
                data.forEach(ad => {
                    productList.innerHTML += `
                        <div class="product-item">
                            <div class="product">
                                <div class="product-info">
                                    <h3>${ad.title}</h3>
                                    <p>
                                        ${ad.university}
                                        <br>Precio: ${ad.price} euros
                                        <br>Estado: ${ad.state}
                                    </p>
                                </div>
                                <div class="product-actions">
                                    ${
                                        ad.state !== 'Vendido'
                                        ? `<button class="mark-sold-button" onclick="openMarkSoldModal(${ad.id_ad})">Marcar como Vendido</button>`
                                        : ''
                                    }
                                    <button class="mark-sold-button" onclick="modifyProduct(${ad.id_ad})">
                                        Modificar anuncio
                                    </button>
                                    <button class="delete-button" onclick="deleteProduct(${ad.id_ad})">
                                        <img src="../images/eliminar.png" alt="Eliminar" class="delete-icon">
                                    </button>
                                </div>
                            </div>
                        </div>`;
                });
            } else {
                productList.innerHTML = '<p>No hay productos en esta categoría.</p>';
            }
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

function deleteProduct(adId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        fetch(`/perfil/delete/${adId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Producto eliminado con éxito');
                    location.reload(); 
                } else {
                    alert('Error al eliminar el producto');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el producto');
            });
    }
}

function modifyProduct(adId) {
    window.location.href = `/modificarPublicacion?id_ad=${adId}`;
}

// Función para abrir el modal y mostrar los usuarios disponibles
function openMarkSoldModal(adId) {
    const modal = document.getElementById('modal-mark-sold');
    const userList = document.getElementById('user-list');
    const searchBar = document.getElementById('search-users');

    userList.innerHTML = ''; // Limpia la lista de usuarios antes de cargar

    // Fetch usuarios desde el backend
    fetch('/perfil/conversaciones')
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                // Renderiza la lista de usuarios
                userList.innerHTML = users.map(user => `
                    <li>
                        <span>${user.username}</span>
                        <button class="btn btn-select" onclick="markAsSold(${adId}, ${user.id_user})">Seleccionar</button>
                    </li>
                `).join('');

                // Agrega el evento de búsqueda a la barra
                searchBar.addEventListener('input', () => {
                    const query = searchBar.value.toLowerCase(); // Texto ingresado en minúsculas
                    const items = userList.querySelectorAll('li'); // Selecciona todos los elementos de la lista

                    // Filtra los elementos de la lista
                    items.forEach(item => {
                        const username = item.querySelector('span').textContent.toLowerCase(); // Nombre del usuario
                        item.style.display = username.includes(query) ? '' : 'none'; // Muestra/oculta según la coincidencia
                    });
                });
            } else {
                userList.innerHTML = '<li>No tienes conversaciones abiertas.</li>';
            }
        })
        .catch(error => {
            console.error('Error al obtener usuarios:', error);
            userList.innerHTML = '<li>Error al cargar usuarios.</li>';
        });

    // Muestra el modal
    modal.style.display = 'block';
}

// Función para cerrar el modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal-mark-sold').style.display = 'none';
});

// Función para marcar un producto como vendido con un comprador seleccionado
function markAsSold(adId, buyerId) {
    fetch(`/perfil/marcar-vendido/${adId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto marcado como vendido');
                location.reload();
            } else {
                alert(data.message || 'Error al marcar como vendido');
            }
        })
        .catch(error => console.error('Error al marcar como vendido:', error));
}

// Función para cerrar el modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal-mark-sold').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => mostrarProductos('en-venta'));