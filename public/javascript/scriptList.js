// Toggle the profile dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function myFunction(x) {
    x.classList.toggle("change");
    const menuSection = document.getElementById('dropdown-content-menu');
    menuSection.classList.toggle('active');

    const rejillaArticulos = document.querySelector('.rejilla-articulos');
    rejillaArticulos.classList.toggle('move-right');

    const botonVender = document.querySelector('.boton-venta');
    botonVender.classList.toggle('move-right');
}

function filterProducts(){
    const filter = document.getElementById("barra-busqueda").value.toLowerCase();
    const cards = document.querySelectorAll(".tarjeta-articulo"); 

    cards.forEach(card  =>{
        const description = card.querySelector("p").textContent.toLowerCase();
        const university = card.querySelector("img").alt.toLowerCase();

        const matchDes = description.includes(filter);
        const matchUni = university.startsWith(filter);

        if(matchDes || matchUni){
            card.style.display = "block";
        } else{
            card.style.display = "none";
        }
    });
}

document.getElementById("barra-busqueda").addEventListener("input", filterProducts);

//filtrado por uni desde hamburger menu
document.querySelectorAll('.filter-university').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir la navegación por defecto del enlace
        const selectedUniversity = this.getAttribute('data-university').toLowerCase();
        filterByUniversity(selectedUniversity);
    });
});

function filterByUniversity(university) {
    const cards = document.querySelectorAll(".tarjeta-articulo");

    cards.forEach(card => {
        const cardUniversity = card.querySelector("img").alt.toLowerCase();

        if (cardUniversity.includes(university)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}


// Pop-up de tarjeta de artículo
document.querySelectorAll('.tarjeta-articulo').forEach(card => {
    card.addEventListener('click', function() {
        const imgSrc = card.querySelector('img').src;
        const title = card.querySelector('.titulo-articulo').textContent; // conseguir title
        const description = card.querySelector('.descripcion-articulo').textContent; //conseguir descripción del producto
        const price = card.querySelector('span').textContent;
        const university = card.querySelector('img').alt;

        // Asignar los valores al pop-up
        document.getElementById('popup-img').src = imgSrc;
        document.getElementById('popup-title').textContent = title;
        document.getElementById('popup-description').textContent = description;
        document.getElementById('popup-price').textContent = `Precio: ${price}`;
        document.getElementById('popup-university').textContent = `Universidad: ${university}`;

        // Mostrar el pop-up y la capa de fondo
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    });
});

// Función para cerrar el pop-up
function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

// event listener para para cerrar el pop-up al hacer clic fuera -> overlay
document.getElementById('popup-overlay').addEventListener('click', closePopup);