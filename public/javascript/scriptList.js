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