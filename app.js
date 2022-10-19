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

////////////////////////////////////////////////////////
// const obtenerParamDeBusqueda = (paramDeBusqueda) => {
//   let url = baseURL;
//   let buscarParam = `?apikey=${apiPublic}&offset=${offset}`;

//   //BUSCO EL SELECT DE COMIC O PERSONAJE
//   // const tipo = traerElemento('#selectTipo').value
//   // console.log(tipo)

//   if (selectTipo.value === "comics") {
//     url += selectTipo.value + buscarParam; //traigo data de tipo comic o personaje
//   }
//   fetch(url)
//     .then((resp) => resp.json())
//     .then((json) => console.log(json))
//     .catch((err) => console.error(err));
// };

// obtenerParamDeBusqueda();

// const getData = async () => {
//   loader.classList.remove("esconder");
//   setTimeout(() => {
//     loader.classList.add("esconder");
//     root.classList.remove("esconder");
//   }, 2000);

//   const url = `http://gateway.marvel.com/v1/public/comics?apikey=${apiPublic}`;
//   fetch(url)
//     .then((resp) => resp.json())
//     .then((json) => console.log(json))
//     .catch((err) => console.error(err));
// };
// getData();

///////////////////ES LO MISMO DE ARRIBA PERO DE OTRA MANERA///////////////////////
//una fx que haga el fetch/buscar que reciba hasta 3 parámetros
//fx que me una la url recurso1 + recurso2 + recurso3
//serch/busqueda

const obtenerParamDeBusqueda = (isSearch) => {
  //seacrhParams
  let buscarParam = `?apikey=${apiPublic}&offset=${offset}`;

  if (!isSearch) {
    return buscarParam;
  }
  return buscarParam;
};
// get api url
const obtenerURL = (resourse, resourseID, subResourse) => {
  const isSearch = !resourseID && !subResourse; //si no te cae nada en estos dos par'ametros hac'e lo sgte.
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

const fetchURL = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json; //me trae la data completa, como un objeto
};

const tipo = traerElemento("#selectTipo").value;
// console.log(tipo)

//BUSCO COMIC
fetchComics = async () => {
  const {
    data: { results, total }, //traigo estos 2 params desde la data
  } = await fetchURL(obtenerURL("comics")); //fx dentro de fx
  // console.log(data)
  printComics(results);
  // console.log(total)
};

const search = () => {
  if (tipo === "comics") {
    fetchComics();
  }
};

//LOADER//
loader.classList.remove("esconder");
  setTimeout(() => {
    loader.classList.add("esconder");
    results.classList.remove("esconder");
  }, 2000);

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
    // const comicCard = document.createElement("div");
    const comicCard = document.createElement("div");

    comicCard.tabIndex = 0;
    comicCard.classList.add("comic");
    //le doy un evento
    comicCard.onclick = () => {
      console.log(comic, comic.id);
    };
    comicCard.innerHTML = `
    
    <div class="col s12 m3">
      <div class="card">
        <div class="card-image">
          <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-thumbnail">
        </div>
        <div class="card-content">
          <p>Nombre: ${comic.title}</p>
        </div>
        <div class="card-action">
          <a href="#">ver mas...</a>
        </div>
      </div>
    </div>

    `;
    results.append(comicCard);
  }
};

//INICIO//
const inicio = () => {
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
