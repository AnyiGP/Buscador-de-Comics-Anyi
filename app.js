const root = document.getElementById("root");
// const mujer = document.getElementById("mujer");
// const hombre = document.getElementById("hombre");
// const todos = document.getElementById("todos");
const selectTipo = document.querySelector("#selectTipo");
const selectOrden = document.querySelector("#selectOrden");

//FX PARA TRAER LOS ELEMENTOS, POR EJEMPLO EL SELECT TIPO//
const traerElemento = (elemento) => document.querySelector(elemento);


// //paginador
// const paginaActual = document.querySelector("#pagina-actual");
// const totalPaginas = document.querySelector("#total-paginas");
// const firstPage = document.querySelector("#first-page");
// const previusPage = document.querySelector("#previus-page");
// const nextPage = document.querySelector("#next-page");
// const lastPage = document.querySelector("#last-page");

// //LOADER
const loader = document.getElementById("contenedor");

//API marvel
const apiPublic = "7c06533ff513d1f2219290cbe4e49e20";
const apiPrivate = "cad2a3938979fe8b84a5c8ba91a7d37810873c88";
const baseURL = "https://gateway.marvel.com/v1/public/"; // base de la api a la que le voy a ir agregando end point para pedirle lo que valla necesitando////////
let offset = 0; //que empiece en 0

///////////////////ES LO MISMO DE ARRIBA PERO DE OTRA MANERA///////////////////////

const obtenerParamDeBusqueda = (isSearch) => {
  //seacrhParams
  let buscarParam = `?apikey=${apiPublic}&offset=${offset}`;

  if (!isSearch) {
    return buscarParam;
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

const fetchURL = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json; //me trae la data completa, como un objeto
};

// const tipo = traerElemento("#selectTipo").value;
// console.log(tipo)

//BUSCO COMIC
fetchComics = async () => {
  const {
    data: { results, total }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("comics")); //fx dentro de fx
  borrarResults()
  printComics(results);

  // console.log(total)
  //updateResultsCount
  actualizarResultados(total);
};

//PINTAR COMICS//
//buscamos donde lo vamos a pintar los resultados y el total
const results = traerElemento("#results");
console.log(cantidadDeResultados);

const printComics = (comics) => {
  if (comics.length === 0) {
    results.innerHTML =
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
    results.append(comicCard);
  }
};


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
  mostrarSeccionDetallesComic()
  // traerPersonajeDelComicId(characterId)
};

//lo de abajo ver si lo puedo hacer con el dom

const imagenComic = traerElemento("#imagenComic");
const titulo = traerElemento("#titulo");
const fechaDePublicacion = traerElemento("#fechaDePublicacion");
const guionistas = traerElemento("#guionistas");
const detalles = traerElemento("#detalles");
const seccionDetallesComic = traerElemento("#seccionDetallesComic");
const contenedorResultados = traerElemento('#contenedorResultados')

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
// const traerPersonajeDelComicId = async (comicId) => {
//   // console.log('aca van los comics en los que participo') //url + /v1/GET /v1/public/comics/{comicId}/characters
//   const {
//     data: {
//       results, total
//     }, //traigo estos 2 params desde la data
//   } = await fetchURL(obtenerURL("comics", comicId, 'characters')); //fx dentro de fx
//   // const comicDelPersonaje = `${character.comics}`
//   console.log(results, total)
//   printPersonajeDelComic(results)
//   actualizarResultados(total)
// }

// const personajeDelComic = traerElemento('#personajeDelComic')

// const printPersonajeDelComic = (characters) => {
//   if (characters.length === 0) {
//     personajeDelComic.innerHTML =
//       '<h2 class="sin-resultado">No se encontraron resultados para el pedido</h2>';
//   }

//   //FOR OF ENTRE UN FOR Y UN FOR EACH, SE USA PARA ARREGLOS
//   //variable iteratora characters/iterator
//   for (const character of characters) {
//     console.log(character); //va a traer el objeto por cada comic
//     const personajeCard = document.createElement("div");

//     personajeCard.tabIndex = 0;
//     personajeCard.classList.add("comic");
//     //le doy un evento
//     personajeCard.onclick = () => {
//       console.log(character, character.id);
//       fetchcharacterId(character.id); //ejecuto esta función para que me de el id de cada comic, la función está mas abajo, le paso el agumento comic y comic id
  
//     };
//     personajeCard.innerHTML = `
    
//     <div class="col s12 m3">
//       <div class="card">
//         <div class="card-image">
//           <img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}" alt="${character.name}" class="character-thumbnail">
//         </div>
//         <div class="card-content">
//           <p>Nombre: ${character.name}</p>
//         </div>
//       </div>
//     </div>

//     `;
//     personajeDelComic.append(personajeCard);
//   }
// };

// ///////////////////////////////////////////

//DIV DE MUESTRA LOS PERSONAJES ID resultsPersonajes 


//si estoy en personajes, para salir seleccionar comic, btn buscar, me llev a seccion de comic


const mostrarSeccionDetallesComic = () => {
  seccionDetallesComic.classList.remove('esconder')
  contenedorResultados.classList.add('esconder')
  return mostrarSeccionDetallesComic
}







// console.log(mostrarSeccionDetallesComic)

///BOTON BUSCAR///
const btnBuscar = traerElemento('#btn-buscar')


/////////////////////////////////////////////////////
//////////////////PERSONAJES//////////////////////
////////////////////////////////////////////////////////
//borro resultados anteriores
const borrarResults = () => results.innerHTML = ''


//BUSCO PERSONAJES
fetchPersonajes = async () => {
  
  const {
    data: { results, total }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("characters")); //fx dentro de fx
  console.log(results, total)
  borrarResults()
  printPersonajes(results);

  // console.log(total)
  //updateResultsCount
  actualizarResultados(total);
};


// //IMPRIMIR PERSONAJES
//fetchPersonajes(characters, characters.id)
const resultadoPersonajes = traerElemento("#results");
console.log(cantidadDeResultados);

const printPersonajes = (characters) => {
  if (characters.length === 0) {
    results.innerHTML =
      '<h2 class="sin-resultado">No se encontraron resultados para el pedido</h2>';
  }

  //'FOR OF' ENTRE UN FOR Y UN FOR EACH, SE USA PARA ARREGLOS
  //variable iteratora personaje/iterator
  for (const character of characters) {
    console.log(character); //va a traer el objeto por cada personaje
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
  console.log(charactersId)
  const {
    data: {
      results: [character],
    },
  } = await fetchURL (obtenerURL('characters', charactersId))
  
}

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
  mostrarSeccionDetallesPersonaje()
  traerComicsDelPersonajeId(characterId)
};

//lo de abajo ver si lo puedo hacer con el dom
const seccionDetallesPersonaje = traerElemento('#seccionDetallesPersonaje')
const imagenPersonaje = traerElemento("#imagenPersonaje");
const nombre = traerElemento("#nombre");
const descripcion = traerElemento('#descripcion')

const actualizarDetallesDePersonaje = (
  imgPersonaje,
  name,
  description
) => {
  //le voy a pasar todos los arg de mas arriba a estos params
  imagenPersonaje.src = imgPersonaje;
  nombre.innerHTML = name;
  descripcion.innerHTML = description
};

//////////////////

const traerComicsDelPersonajeId = async (characterId) => {
  // console.log('aca van los comics en los que participo') //url + /v1/public/characters/{characterId}/comics
  const {
    data: {
      results, total
    }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("characters", characterId, 'comics')); //fx dentro de fx
  // const comicDelPersonaje = `${character.comics}`
  console.log(results, total)
  printComicsDelPersonaje(results)
  actualizarResultados(total)
}

const comicsDelPersonaje = traerElemento('#comicsDelPersonaje')

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

//AGREGAR UNA FX QUE AL SELECCIONAR EL COMIC DEL PERSONAJE ME LLEVE A ESE COMIC Y ME MUESTRE LOS PEROSNAJES DE ESE COMIC

//AGREGAR UNA FX QUE AL SELECCIONAR EL PERSONAJE DEL COMIC ME LLEVE A ESE PERSONAJE Y ME MUESTRE LOS COMICS DE ESE PERSONAJE

//AGREGAR UNA FUNCIÓN QUE QUE AL SELECCIONAR NUEVAMENTE EN EL SELEC COMIC ME VUELVA A MOSTRAR LA SECCIÓN DE COMIC





const mostrarSeccionDetallesPersonaje = () => {
  seccionDetallesPersonaje.classList.remove('esconder')
  contenedorResultados.classList.add('esconder')
  return mostrarSeccionDetallesComic
}

// console.log(mostrarSeccionDetallesComic)

//INPUT//
//Al agregar un nombre de comic que busque ese comic, si selecciona personajes y agrega nobre de ese personaje que busque ese personaje



//FILTROS
//hacer una copia del arr de los comics y ordenarlos con el sort o usar el orderBy como parámetro que ya trae la api de marvel

// const ordenarPor = document.getElementById("ordenar-por");

// ordenarPor.addEventListener("change", () => {

//A/Z

// if (ordenarPor.value === "a-z") {
//   operaciones.sort((a, b) => {
//     if (a.descripcion.toLowerCase() < b.descripcion.toLowerCase()) {
//       return -1;
//     }
//     if (a.descripcion.toLowerCase() > b.descripcion.toLowerCase()) return 1;
//   });
// }
// pintarOperaciones(operaciones);

// //Z/A

// if (ordenarPor.value === "z-a") {
//   operaciones.sort((a, b) => {
//     if (a.descripcion.toLowerCase() > b.descripcion.toLowerCase()) {
//       return -1;
//     }
//     if (a.descripcion.toLowerCase() < b.descripcion.toLowerCase()) return 1;
//   });
// }
// pintarOperaciones(operaciones);
//ORDENAR POR

//MAS RECIENTE
// if (ordenarPor.value === "mas-reciente") {
//   operaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
// }
// pintarOperaciones(operaciones);

// //MENOS RECIENTE
// if (ordenarPor.value === "menos-reciente") {
//   operaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
// }
// pintarOperaciones(operaciones);

// });

const search = () => {
  if (selectTipo.value === "comics") {
    fetchComics();
  }
  if (selectTipo.value === "characters") {
    fetchPersonajes();
  }
  
};

//LOADER//
loader.classList.remove("esconder");
setTimeout(() => {
  loader.classList.add("esconder");
  results.classList.remove("esconder");
}, 2000);

//2.37hs
//INICIO//
const inicio = () => {
  btnBuscar.addEventListener('click', () => {
    search()
  })
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


//cuando el usuario le de click al btn avanzar solo una pagina, le paso como offset 19 y vuelvo a ejecutar la función de getSearchParams u obtener parametros de búsqueda
//para el btn que me lleve a la ultima página, debemos hacer que me divida la cantidad de resultados por 20 para que me de la cantidad de las páginas

// //   //NUEVA FUNCION PARA HACER LO DEL PAGINADOR

// let pagina = 1;
// let total = 0;

// const getData2 = async () => {
//   loader.classList.remove('esconder')

//   const url = `https://rickandmortyapi.com/api/character/?page=${pagina}`;

//   //NUEVA FORMA DE HACER PROMESAS ASYNC AWAIT
//   paginaActual.innerHTML = pagina;
//   const resp = await fetch(url);
//   const json = await resp.json();
//   //ejecutamos la fx print data
//   printData(json.results);
//   total = json.info.pages;
//   paginaActual.innerHTML = pagina;
//   totalPaginas.innerHTML = total;
//   data = json;
//   updatePagination();
//   setTimeout(() => {
//     loader.classList.add('esconder')
//     root.classList.remove('esconder')
//   },1000)
//   return json;
// };

// let data = [];

// const printData = (json) => {
//   // console.log(json); //  []
//   const arr = json;
//   let card = "";
//   arr.forEach((personaje) => {
//     const { name, gender, species, status, origin, location, image } =
//       personaje;
//     card += `
//       <div class="col s12 m6 l3">
//         <div class="card">
//           <div class="card-image">
//             <img src=${image} alt=${name}>
//           </div>
//           <div class="card-content">
//             <p>Nombre: ${name}</p>
//             <p>Genero: ${gender}</p>
//             <p>Species: ${species}</p>
//             <p>Status: ${status}</p>
//             <p>Origin: ${origin.name}</p>
//             <p>Location: ${location.name}</p>
//           </div>
//           <div class="card-action">
//             <a href="#">ver mas...</a>
//           </div>
//         </div>
//       </div>
//     `;
//   });
//   root.innerHTML = card;
// };

// const printData = (json) => {
//   // console.log(json); //  []
//   const arr = json;
//   let card = "";
//   arr.forEach((personaje) => {
//     const { name, gender, species, status, origin, location, thumbnail } =
//       personaje;
//     card += `
//       <div class="col s12 m6 l3">
//         <div class="card">
//           <div class="card-image">
//             <img src=${thumbnail.path}${thumbnail.extension} alt=${name}>
//           </div>
//           <div class="card-content">
//             <p>Nombre: ${name}</p>
//             <p>Genero: ${gender}</p>
//             <p>Species: ${species}</p>
//             <p>Status: ${status}</p>
//             <p>Origin: ${origin.name}</p>
//             <p>Location: ${location.name}</p>
//           </div>
//           <div class="card-action">
//             <a href="#">ver mas...</a>
//           </div>
//         </div>
//       </div>
//     `;
//   });
//   root.innerHTML = card;
//   console.log(card);
// };

// console.log(printData);

$(document).ready(function () {
  $(".dropdown-trigger").dropdown();
  // pagination(getData2());
});

// //Fx CON LA QUE FUNCIONAN LOS FILTROS ES LO MISMO QUE LA DE ARRIBA PERO SIN PAGINADOR, 24-8

// // const getData = async () => {
// //   const url = 'https://rickandmortyapi.com/api/character/'; //parametros que le pasamos a la api
// //   //promesa que tiene estado dependiente
// //   fetch(url)
// //     .then((resp) => resp.json())
// //     .then((json) => {
// //       printData(json.results); // []
// //       data = json;
// //     }) //respuesta primera
// //     .catch((err) => console.error(err)); //error
// //   }

// // //////////FILTROS///////////////

// mujer.addEventListener("click", (e) => {
//   const female = data.results.filter(
//     (personaje) => personaje.gender === "Female"
//   );
//   printData(female); // []
//   // console.log(data);
//   console.log(female);
// });

// hombre.addEventListener("click", (e) => {
//   const male = data.results.filter((personaje) => personaje.gender === "Male");
//   printData(male); // []
//   // console.log(data);
//   console.log(male);
// });

// todos.addEventListener("click", (e) => {
//   const mostrarTodos = data.results;
//   printData(mostrarTodos); // []
// });

// /////////////PAGINATION FUNCION

// const pagination = async (promesa) => {
//   const result = await promesa;
//   console.log(result);
//   //pag sgte
//   nextPage.addEventListener("click", () => {
//     pagina += 1;
//     getData2();
//   });
//   //pagina previa
//   previusPage.addEventListener("click", () => {
//     pagina -= 1;
//     getData2();
//   });
//   //ultima pagina que entre a la data
//   console.log(promesa);
//   lastPage.addEventListener("click", () => {
//     if (pagina <= result.info.pages) {
//       pagina = result.info.pages;
//       getData2();
//     }
//   });
//   firstPage.addEventListener("click", () => {
//     if (pagina >= 2) {
//       pagina = 1;
//       getData2();
//     }
//   });
// };

// const updatePagination = () => {
//   //actualiza
//   if (pagina <= 1) {
//     previusPage.disabled = true;
//     firstPage.disabled = true;
//   } else {
//     previusPage.disabled = false;
//     firstPage.disabled = false;
//   }
//   if (pagina == total) {
//     nextPage.disabled = true;
//     lastPage.disabled = true;
//   } else {
//     nextPage.disabled = false;
//     lastPage.disabled = false;
//   }
// };
