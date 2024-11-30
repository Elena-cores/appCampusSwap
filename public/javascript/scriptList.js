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

// filtrado por barra de busqueda 
function filterProducts(){
    const filter = document.getElementById("barra-busqueda").value.toLowerCase();
    const cards = document.querySelectorAll(".tarjeta-articulo"); 

    cards.forEach(card  =>{
        const title = card.querySelector('.titulo-articulo').textContent.toLowerCase(); 
        const description = card.querySelector("p").textContent.toLowerCase();
        const university = card.querySelector("img").alt.toLowerCase();

        const matchTitle = title.includes(filter);
        const matchDes = description.includes(filter);
        const matchUni = university.startsWith(filter);

        if(matchTitle || matchDes || matchUni){
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

// filtrado por categoría (LIBROS o ARTICULOS DE HOGAR)
document.querySelectorAll('.filter-category').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir la navegación por defecto del enlace
        const category = this.getAttribute('data-category').toLowerCase();

        // palabras clave por categoria
        const keywords = {
            libros: ["libro", "novela", "textbook", "cuaderno", "volumen", "ejemplar", "texto", "antología", "guía"],
            hogar: ["casa", "hogar", "cocina", "cama", "monitor", "dormitorio", "utensilios", "mueble", "mesa", "silla", "vaso", "limpieza"]
        };

        const cards = document.querySelectorAll(".tarjeta-articulo");
        cards.forEach(card => {
            const title = card.querySelector('.titulo-articulo').textContent.toLowerCase();
            const description = card.querySelector('.descripcion-articulo').textContent.toLowerCase();

            // verificar si alguna palabra clave está presente en title o description
            const matches = keywords[category].some(keyword => title.includes(keyword) || description.includes(keyword));

            // show/hide tarjeta según si hay coincidencias o no..
            card.style.display = matches ? "block" : "none";
        });
    });
});


// Pop-up de tarjeta de artículo en listado
document.querySelectorAll('.tarjeta-articulo').forEach(card => {
    card.addEventListener('click', function() {
        const imgSrc = card.querySelector('img').src;
        const title = card.querySelector('.titulo-articulo').textContent; // conseguir title
        const description = card.querySelector('.descripcion-articulo').textContent; //conseguir descripción del producto
        const price = card.querySelector('span').textContent;
        const university = card.querySelector('img').alt;
        const state = card.querySelector('.estado-articulo').textContent;

        // Asignar valores al pop-up
        document.getElementById('popup-img').src = imgSrc;
        document.getElementById('popup-title').textContent = title;
        document.getElementById('popup-description').textContent = description;
        document.getElementById('popup-price').textContent = `Precio: ${price}`;
        document.getElementById('popup-university').textContent = `Universidad: ${university}`;
        document.getElementById('popup-state').textContent = `Estado: ${state}`; 

        // Mostrar el pop-up y la capa de fondo
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    });
});

// función para cerrar el pop-up
function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

// event listener para para cerrar el pop-up al hacer clic fuera -> overlay
document.getElementById('popup-overlay').addEventListener('click', closePopup);






