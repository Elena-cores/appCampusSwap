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