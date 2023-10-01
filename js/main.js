const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    
        const div = document.createElement("div");
        div.classList.add("pokemon");
        div.innerHTML = `
            <div class="pokemon-imagen">
                <img src="${poke.sprites.front_default}" alt="${poke.name}">
            </div>
            <div class="pokemon-info">
                <div class="nombre-contenedor">
                    <p class="pokemon-id">#${pokeId}</p>
                    <h2 class="pokemon-nombre">${poke.name}</h2>
                </div>
                <div class="pokemon-tipos">
                    ${tipos}
                </div>
                <div>
                    <button class="btn btn-secondary sizeBtn agregar-pokemon" data-src="${poke.sprites.front_default}">
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        `;
    
        const agregarBtn = div.querySelector(".agregar-pokemon");
        agregarBtn.addEventListener("click", () => {
            // Función para agregar el Pokémon a una pokebola
            agregarPokemonAPokebola(poke.sprites.front_default);
        });
    
        listaPokemon.append(div);
    }
    
    let pokebolasDisponibles = document.querySelectorAll(".pokebola");

    function agregarPokemonAPokebola(imagenPokemon) {
        // Buscar una pokebola vacía
        const pokebolaVacia = Array.from(pokebolasDisponibles).find((pokebola) => !pokebola.hasChildNodes());
    
        if (pokebolaVacia) {
            // Crear un elemento de imagen y establecer su fuente como la imagen del Pokémon
            const imagen = document.createElement("img");
            imagen.src = imagenPokemon;
            // Asignar un identificador  a la imagen
            imagen.id = imagenPokemon;
    
            // Agregar un evento click a la imagen para eliminarla
            imagen.addEventListener("click", () => {
                eliminarPokemonDePokebola(imagen);
            });
    
            // Agregar la imagen del Pokémon a la pokebola vacía
            pokebolaVacia.appendChild(imagen);

            Toastify({
                text: "El pokemon ahora está en tu equipo",
                duration: 3000
            }).showToast();
            
        } else {
            // Cuando todas las pokebolas están ocupadas sale esta alerta
            Swal.fire({
                icon: 'error',
                title: 'Todas las pokebolas estan ocupadas',
                text: 'Seis pokemons son el maximo por equipo',
              })
        }
    }
    function eliminarPokemonDePokebola(imagenPokemon) {
        // Encontrar la pokebola que contiene la imagen del Pokémon
        const pokebolaConPokemon = Array.from(pokebolasDisponibles).find((pokebola) =>
            pokebola.contains(imagenPokemon)
        );
    
        if (pokebolaConPokemon) {
            // Eliminar la imagen del Pokémon de la pokebola
            pokebolaConPokemon.removeChild(imagenPokemon);
            Toastify({
                text: "Sacaste un Pokémon de tu equipo",
                duration: 3000,
                backgroundColor:"var(--clr-black)"
            }).showToast();
        }
    }
        



botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))



// BUSCADOR POKEMON --------------------------------
const formBusqueda = document.getElementById("busquedaForm");
const inputBuscar = document.getElementById("buscarPokemon");

formBusqueda.addEventListener("submit", (event) => {
    event.preventDefault();
    const valorBusqueda = inputBuscar.value.trim().toLowerCase();

    if (valorBusqueda === "") {
        // Si el valor de búsqueda está vacío, muestra todos los Pokémon
        mostrarTodosLosPokemon();
    } else {
        // Si hay un valor de búsqueda, busca el Pokémon específico
        buscarPokemon(valorBusqueda);
    }
});

function buscarPokemon(valor) {
    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then((data) => {
                const nombrePokemon = data.name.toLowerCase();
                const idPokemon = data.id.toString();

                if (nombrePokemon.includes(valor) || idPokemon === valor) {
                    mostrarPokemon(data);
                }
            });
    }
}

function mostrarTodosLosPokemon() {
    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then((data) => {
                mostrarPokemon(data);
            });
    }
}




// Obtener el botón "ok" y el contenedor de equipos
const btnOk = document.querySelector(".btnOk");
const equiposContainer = document.querySelector(".equipos-container");

// Inicializa la lista de equipos desde el Local Storage
let equipos = JSON.parse(localStorage.getItem("equipos")) || [];

// Función para guardar equipos en el Local Storage
function guardarEquiposEnLocalStorage() {
    localStorage.setItem("equipos", JSON.stringify(equipos));
}

// Función para agregar un equipo a la lista y actualizar el Local Storage
function agregarEquipoAlLocalStorage(equipo) {
    equipos.push(equipo);
    guardarEquiposEnLocalStorage();
}

// Función para cargar equipos desde el Local Storage y mostrarlos en la página
function cargarEquiposDesdeLocalStorage() {
    equipos.forEach((equipo, index) => {
        const equipoDiv = document.createElement("div");
        equipoDiv.classList.add("eliminar", "d-flex", "justify-content-center", "align-items-center", "pt-4", "pb-4", "eliminar");

        equipo.forEach((pokemon) => {
            const pokeDiv = document.createElement("div");
            pokeDiv.classList.add(`poke${pokemon.id}`);

            const imgPokemon = document.createElement("img");
            imgPokemon.src = pokemon.imagen;
            imgPokemon.alt = pokemon.nombre;

            pokeDiv.appendChild(imgPokemon);
            equipoDiv.appendChild(pokeDiv);
        });

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger", "btnDelete");
        btnDelete.dataset.index = index; // Guarda el equipo

        const imgDelete = document.createElement("img");
        imgDelete.src = "./img/trash.svg";
        imgDelete.alt = "Eliminar";

        btnDelete.appendChild(imgDelete);
        equipoDiv.appendChild(btnDelete);

        btnDelete.addEventListener("click", (event) => {
            const indexToDelete = event.target.dataset.index;
            equipos.splice(indexToDelete, 1);
            guardarEquiposEnLocalStorage();
            equiposContainer.removeChild(equipoDiv);
        });

        equiposContainer.appendChild(equipoDiv);
    });
}

// Llama a la función para cargar equipos desde el Local Storage al cargar la página
cargarEquiposDesdeLocalStorage();

// Agrega un evento clic al botón "ok"
btnOk.addEventListener("click", () => {
    const equipo = [];

    for (let i = 1; i <= 6; i++) {
        const pokebola = document.querySelector(`#pokebola${i}`);

        if (pokebola && pokebola.hasChildNodes()) {
            const imagenPokemon = pokebola.querySelector("img");

            if (imagenPokemon) {
                const id = i;
                const nombre = imagenPokemon.alt;
                const imagen = imagenPokemon.src;
                equipo.push({ id, nombre, imagen });
            }
        }
    }

    if (equipo.length > 0) {
        agregarEquipoAlLocalStorage(equipo);

        // Actualizar los divs de los equipos en la página
        const equipoDiv = document.createElement("div");
        equipoDiv.classList.add("eliminar", "d-flex", "justify-content-center", "align-items-center", "pt-4", "pb-4", "eliminar");

        equipo.forEach((pokemon) => {
            const pokeDiv = document.createElement("div");
            pokeDiv.classList.add(`poke${pokemon.id}`);

            const imgPokemon = document.createElement("img");
            imgPokemon.src = pokemon.imagen;
            imgPokemon.alt = pokemon.nombre;

            pokeDiv.appendChild(imgPokemon);
            equipoDiv.appendChild(pokeDiv);
        });

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger", "btnDelete");
        btnDelete.dataset.index = equipos.length - 1;

        const imgDelete = document.createElement("img");
        imgDelete.src = "./img/trash.svg";
        imgDelete.alt = "Eliminar";

        btnDelete.appendChild(imgDelete);
        equipoDiv.appendChild(btnDelete);

        btnDelete.addEventListener("click", (event) => {
            const indexToDelete = event.target.dataset.index;
            equipos.splice(indexToDelete, 1);
            guardarEquiposEnLocalStorage();
            equiposContainer.removeChild(equipoDiv);

            Toastify({
                text: "Equipo eliminado",
                duration: 3000,
                backgroundColor: "crimson"
            }).showToast();
        });

        equiposContainer.appendChild(equipoDiv);
        Swal.fire({
            icon: 'success',
            title: 'Equipo Pokémon registrado',
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'No has agregado Pokémon al equipo',
            text: 'Agrega al menos un Pokémon antes de registrar el equipo',
        });
    }


    // Limpia las pokebolas
    for (let i = 1; i <= 6; i++) {
        const pokebola = document.querySelector(`#pokebola${i}`);
        while (pokebola.firstChild) {
            pokebola.removeChild(pokebola.firstChild);
        }
    }
});


