const root = document.getElementById("root");
// const todos = document.getElementById("todos");
const selectTipo = document.querySelector("#selectTipo");
const selectOrden = document.querySelector("#selectOrden");

//FX PARA TRAER LOS ELEMENTOS, POR EJEMPLO EL SELECT TIPO//
const traerElemento = (elemento) => document.querySelector(elemento);

// //LOADER
const loader = document.getElementById("contenedor");

//API marvel
const apiPublic = "7c06533ff513d1f2219290cbe4e49e20";
const apiPrivate = "cad2a3938979fe8b84a5c8ba91a7d37810873c88";
const baseURL = "https://gateway.marvel.com/v1/public/"; // base de la api a la que le voy a ir agregando end point para pedirle lo que valla necesitando////////
let offset = 0; //que empiece en 0

///////////////////ES LO MISMO DE ARRIBA PERO DE OTRA MANERA//OBTENER PARÁMETROS DE BUSQUEDA/////////////////////

const obtenerParamDeBusqueda = (isSearch) => {
  //seacrhParams
  let buscarParam = `?apikey=${apiPublic}&offset=${offset}`;

  if (!isSearch) {
    return buscarParam;
  }

  if (!autocompleteInput.value.length) {
    return buscarParam;
  }

  ////seleccion comic, agregar titulo comic, buscar comic.//
  if (selectTipo.value === "comics") {
    buscarParam += `&titleStartsWith=${autocompleteInput.value}`; //saco de la cocumentación
  }


  if (selectTipo.value === "characters") {
    buscarParam += `&nameStartsWith=${autocompleteInput.value}`; //saco de la cocumentación
  }

  return buscarParam;
};

//una fx que haga el fetch/buscar que reciba hasta 3 parámetros
//fx que me una la url recurso1 + recurso2 + recurso3
//serch/busqueda
// get api url
const obtenerURL = (resourse, resourseID, subResourse) => {
  const isSearch = !resourseID && !subResourse; //si no te cae nada en estos dos paras hace lo sgte.
  console.log(isSearch); //true

  let url = `${baseURL}${resourse}`;

  if (resourseID) {
    url += `/${resourseID}`;
  }

  if (subResourse) {
    url += `/${subResourse}`;
  }

  url += obtenerParamDeBusqueda(isSearch);
  return url;
};

//PINTAR NUMERO DE RESULTADOS//
const numResultado = traerElemento("#numResultado");
let resultCount = 0;

const actualizarResultados = (count) => {
  numResultado.innerHTML = count; //creo let resultCount que inicie en 0
  resultCount = count; //count es un param/total que le paso como argumento total que se ejecuta mas abajo
};

//TRAE LA DATA DE TODOS LOS COMICS CON UN LIMITE DE 20

const fetchURL = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  return json; //me trae la data completa, como un objeto
};

// const tipo = traerElemento("#selectTipo").value;
// console.log(tipo)

////////////////////////////////////////////////////////////
//INPUT//////////////////////////////////////////////////////

const autocompleteInput = traerElemento("#autocomplete-input");

/////////////////////////////////////////////////////////////
//BUSCO COMIC
/////////////////////////////////////////////////////////////

fetchComics = async () => {
  const {
    data: { results, total }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("comics")); //fx dentro de fx
  borrarResults();
  printComics(results);

  // console.log(total)
  //updateResultsCount
  actualizarResultados(total);
};

//IMPRIMIR COMICS//
//buscamos donde lo vamos a pintar los resultados y el total
const results = traerElemento("#results");
// console.log(cantidadDeResultados);

const printComics = (comics) => {
  if (comics.length === 0) {
    results.innerHTML =
      '<h2 class="sin-resultado">No se encontraron resultados para el pedido</h2>';
  }

  //FOR OF ENTRE UN FOR Y UN FOR EACH, SE USA PARA ARREGLOS
  //variable iteratora comics/iterator
  for (const comic of comics) {
    // console.log(comic); //va a traer el objeto por cada personaje
    const comicCard = document.createElement("div");

    comicCard.tabIndex = 0;
    comicCard.classList.add("comic");
    //le doy un evento
    comicCard.onclick = () => {
      console.log(comic, comic.id);
      fetchComicsId(comic.id); //ejecuto esta función para que me de el id de cada comic, la función está mas abajo, le paso el agumento comic y comic id
    };
    comicCard.innerHTML = `
    
    <div class="col s12 m3">
      <div class="card">
        <div class="card-image">
          <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-thumbnail">
        </div>
        <div class="card-content">
          <p>${comic.title}</p>
        </div>
      </div>
    </div>

    `;
    results.append(comicCard);
  }
};

/////////////////////////////////////NUEVA FX QUE E STA EN PERSONAJES PERO NO ESTABA EN COMICS//
fetchComic = async (comicId) => {
  // console.log(comicId);
  const {
    data: {
      results: [comic],
    },
  } = await fetchURL(obtenerURL("comics", comicId));
};
/////////////////////////////////

//INGRESAR AL COMIC SELECCIONADO Y TRAER INFORMACIÓN//
fetchComicsId = async (comicId) => {
  // console.log(comicId);
  const {
    data: {
      results: [comic],
    }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("comics", comicId)); //fx dentro de fx
  // console.log(comic);

  //CARGAMOS LA URL PARA TRAER LA IMAGEN A LA TARJETA QUE DETALLA LA INFO coverPath
  const imgComic = `${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`;
  //releaseDate
  const fecha = `12/01/1984`;
  //writers
  const autores = comic.creators.items

    //hago un sting para traerme todos los escritores
    .filter((creator) => creator.role === "writer") //filtro solo escritores
    .map((creator) => creator.name) //creo un nuevo arreglo con escritores
    .join(", "); //separamos los escritores con coma y espacio
  actualizarDetallesDeComic(
    imgComic,
    comic.title,
    fecha,
    autores,
    comic.description
  ); //le paso estos argumento a los params de la fx de mas abajo
  mostrarSeccionDetallesComic();
  traerPersonajeDelComicId(comicId);
};

//lo de abajo ver si lo puedo hacer con el dom

const imagenComic = traerElemento("#imagenComic");
const titulo = traerElemento("#titulo");
const fechaDePublicacion = traerElemento("#fechaDePublicacion");
const guionistas = traerElemento("#guionistas");
const detalles = traerElemento("#detalles");
const seccionDetallesComic = traerElemento("#seccionDetallesComic");
const contenedorResultados = traerElemento("#contenedorResultados");

const actualizarDetallesDeComic = (
  imgComic,
  title,
  fecha,
  autores,
  description
) => {
  //le voy a pasar todos los arg de mas arriba a estos params
  imagenComic.src = imgComic;
  titulo.innerHTML = title;
  fechaDePublicacion.innerHTML = fecha;
  guionistas.innerHTML = autores;
  detalles.innerHTML = description;
};

// ///////////////////////////////////////////
// /////////////////////mostrar personajes que participan de ese comic//////////////////////

const traerPersonajeDelComicId = async (comicId) => {
  // console.log('aca van los comics en los que participo') //url + /v1/GET /v1/public/comics/{comicId}/characters
  const {
    // data: { results, total }, //traigo estos 2 params desde la data
    data: { results, total }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("comics", comicId, "characters")); //fx dentro de fx
  // const comicDelPersonaje = `${character.comics}`
  console.log(results, total); //me trae los personajes del comic, falta cmo ahcer para que se pinten
  printPersonajeDelComic(results); //me tiraba error en la consola
  actualizarResultados(total);
};

const personajeDelComic = traerElemento("#personajeDelComic");

const printPersonajeDelComic = (characters) => {
  if (characters.length === 0) {
    personajeDelComic.innerHTML =
      '<h2 class="sin-resultado">No se encontraron resultados para el pedido</h2>';
  }

  //FOR OF ENTRE UN FOR Y UN FOR EACH, SE USA PARA ARREGLOS
  //variable iteratora characters/iterator
  for (const character of characters) {
    console.log(character); //va a traer el objeto por cada comic
    const personajeCard = document.createElement("div");

    personajeCard.tabIndex = 0;
    personajeCard.classList.add("comic");
    //le doy un evento
    personajeCard.onclick = () => {
      fetchCharacterId(character.id); //ejecuto esta función para que me de el id de cada comic, la función está mas abajo, le paso el agumento comic y comic id
    };
    personajeCard.innerHTML = `

    <div class="col s12 m3">
      <div class="card">
        <div class="card-image">
          <img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}" alt="${character.name}" class="character-thumbnail">
        </div>
        <div class="card-content">
          <p>Nombre: ${character.name}</p>
        </div>
      </div>
    </div>

    `;
    personajeDelComic.append(personajeCard);
  }
};

// ///////////////////////////////////////////

//DIV DE MUESTRA LOS PERSONAJES ID resultsPersonajes

//si estoy en personajes, para salir seleccionar comic, btn buscar, me llev a seccion de comic

const mostrarSeccionDetallesComic = () => {
  seccionDetallesComic.classList.remove("esconder");
  contenedorResultados.classList.add("esconder");
  return mostrarSeccionDetallesComic;
};

///BOTON BUSCAR///
const btnBuscar = traerElemento("#btn-buscar");

/////////////////////////////////////////////////////
//////////////////PERSONAJES//////////////////////
////////////////////////////////////////////////////////
//borro resultados anteriores
const borrarResults = () => (results.innerHTML = "");

//BUSCO PERSONAJES
fetchPersonajes = async () => {
  const {
    data: { results, total }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("characters")); //fx dentro de fx
  // console.log(results, total);
  borrarResults();
  printPersonajes(results);

  // console.log(total)
  //updateResultsCount
  actualizarResultados(total);
};

// //IMPRIMIR PERSONAJES
//fetchPersonajes(characters, characters.id)
const resultadoPersonajes = traerElemento("#results");

const printPersonajes = (characters) => {
  if (characters.length === 0) {
    results.innerHTML =
      '<h2 class="sin-resultado">No se encontraron resultados para el pedido</h2>';
  }

  //'FOR OF' ENTRE UN FOR Y UN FOR EACH, SE USA PARA ARREGLOS
  //variable iteratora personaje/iterator
  for (const character of characters) {
    // console.log(character); //va a traer el objeto por cada personaje
    const personajeCard = document.createElement("div");

    personajeCard.tabIndex = 0;
    personajeCard.classList.add("comic");
    //le doy un evento
    personajeCard.onclick = () => {
      console.log(character.id);
      fetchPersonajeId(character.id); //ejecuto esta función para que me de el id de cada comic, la función está mas abajo, le paso el agumento comic y comic id
    };
    personajeCard.innerHTML = `
    
    <div class="col s12 m3">
      <div class="card">
        <div class="card-image">
          <img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}" alt="${character.name}" class="comic-thumbnail">
        </div>
        <div class="card-content">
          <p>${character.name}</p>
        </div>
      </div>
    </div>

    `;
    results.append(personajeCard);
  }
};

fetchPersonaje = async (charactersId) => {
  // console.log(charactersId);
  const {
    data: {
      results: [character],
    },
  } = await fetchURL(obtenerURL("characters", charactersId));
};

//INGRESAR AL Personaje SELECCIONADO Y TRAER nombre y comics en los que han salido//
fetchPersonajeId = async (characterId) => {
  const {
    data: {
      results: [character],
    }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("characters", characterId)); //fx dentro de fx
  //CARGAMOS LA URL PARA TRAER LA IMAGEN A LA TARJETA QUE DETALLA LA INFO coverPath
  const imgPersonaje = `${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`;
  actualizarDetallesDePersonaje(
    imgPersonaje,
    character.name,
    character.description
  ); //le paso estos argumento a los params de la fx de mas abajo
  mostrarSeccionDetallesPersonaje();
  traerComicsDelPersonajeId(characterId);
};

//lo de abajo ver si lo puedo hacer con el dom
const seccionDetallesPersonaje = traerElemento("#seccionDetallesPersonaje");
const imagenPersonaje = traerElemento("#imagenPersonaje");
const nombre = traerElemento("#nombre");
const descripcion = traerElemento("#descripcion");

const actualizarDetallesDePersonaje = (imgPersonaje, name, description) => {
  //le voy a pasar todos los arg de mas arriba a estos params
  imagenPersonaje.src = imgPersonaje;
  nombre.innerHTML = name;
  descripcion.innerHTML = description;
};

//////////////////

const traerComicsDelPersonajeId = async (characterId) => {
  // console.log('aca van los comics en los que participo') //url + /v1/public/characters/{characterId}/comics
  const {
    data: { results, total }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("characters", characterId, "comics")); //fx dentro de fx
  // const comicDelPersonaje = `${character.comics}`
  console.log(results, total);
  printComicsDelPersonaje(results);
  actualizarResultados(total);
};

const comicsDelPersonaje = traerElemento("#comicsDelPersonaje");

const printComicsDelPersonaje = (comics) => {
  if (comics.length === 0) {
    comicsDelPersonaje.innerHTML =
      '<h2 class="sin-resultado">No se encontraron resultados para el pedido</h2>';
  }

  //FOR OF ENTRE UN FOR Y UN FOR EACH, SE USA PARA ARREGLOS
  //variable iteratora comics/iterator
  for (const comic of comics) {
    console.log(comic); //va a traer el objeto por cada personaje
    const comicCard = document.createElement("div");

    comicCard.tabIndex = 0;
    comicCard.classList.add("comic");
    //le doy un evento
    comicCard.onclick = () => {
      console.log(comic, comic.id);
      fetchComicsId(comic.id); //ejecuto esta función para que me de el id de cada comic, la función está mas abajo, le paso el agumento comic y comic id
    };
    comicCard.innerHTML = `
    
    <div class="col s12 m3">
      <div class="card">
        <div class="card-image">
          <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-thumbnail">
        </div>
        <div class="card-content">
          <p>${comic.title}</p>
        </div>
      </div>
    </div>

    `;
    comicsDelPersonaje.append(comicCard);
  }
};

const mostrarSeccionDetallesPersonaje = () => {
  seccionDetallesPersonaje.classList.remove("esconder");
  contenedorResultados.classList.add("esconder");
  return mostrarSeccionDetallesComic;
};

const search = () => {
  if (selectTipo.value === "comics") {
    fetchComics();
  }
  if (selectTipo.value === "characters") {
    fetchPersonajes();
  }

  // if (selectOrden.value === "-title") {
  //   fetchComics();
  // }
};

//LOADER//
loader.classList.remove("esconder");
setTimeout(() => {
  loader.classList.add("esconder");
  results.classList.remove("esconder");
}, 2000);

//INICIO//
const inicio = () => {
  btnBuscar.addEventListener("click", () => {
    search();
  });
  search();
};

window.onload = inicio;

/////////////////////////ANIMACION////////////////////////////////

element = document.getElementById("animate");

if (element) {
  // reset the transition by...
  element.addEventListener(
    "click",
    function (e) {
      e.preventDefault;

      console.log("element", element.classList);

      // removing the class
      element.classList.remove("run-animation");

      // triggering reflow
      void element.offsetWidth;

      // and re-adding the class
      element.classList.add("run-animation");
    },
    false
  );
}

//PAGINADOR

const paginaActual = document.querySelector("#pagina-actual");
const totalPaginas = document.querySelector("#total-paginas");
const firstPage = document.querySelector("#first-page");
const previusPage = document.querySelector("#previus-page");
const nextPage = document.querySelector("#next-page");
const lastPage = document.querySelector("#last-page");


//USO FX DE fetchURL

const  paginador = () => {
  console.log("funciona");
  nextPage.addEventListener("click", () => {
    offset += console.log(offset);
    // fetchURL(offset)
  });
};

$(document).ready(function () {
  $(".dropdown-trigger").dropdown();
  // paginador(fetchURL());
  paginador();
});

//PAGINADOR CON CALLBACK//

//ejemplo de callback//
const myFx1 = () => {
  console.log("anyi");
  return "soy FX1 ";
};

const myFx2 = (callback) => {
  return "soy FX2 " + callback(); //este callback es la fx1 y lo paso abajo, invoco al callback con los parentesis
};

const rta = myFx2(myFx1); //paso como param la fx1, pero 