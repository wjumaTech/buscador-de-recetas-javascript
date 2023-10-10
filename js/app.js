function iniciarApp() {

  const selectEl = document.querySelector('#categoria');
  selectEl.addEventListener('change', seleccionarCategoria, false);


  const resultadoContenedor = document.querySelector('#resultado');


  obtenerCategorias()

  function obtenerCategorias() {
    let apiUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    return fetch(apiUrl)
      .then(resp => resp.json())
      .then(data => mostrarCategoria(data.categories))
      .catch(err => console.log(err));
  }

  function mostrarCategoria(categories = []) {
    categories.map(category => {
      let opt = document.createElement('OPTION');
      opt.setAttribute('value', category.strCategory);
      opt.textContent = category.strCategory;
      selectEl.appendChild(opt);
    });
  }

  function seleccionarCategoria(e) {
    let categoria = e.target.value;
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    fetch(apiUrl)
      .then(resp => resp.json())
      .then(resultado => mostrarRecetas(resultado.meals))
      .catch(err => console.log(err));
  }

  function mostrarRecetas(recetas = []) {

    limpiarHtml(resultadoContenedor);

    const resultadoHeading = document.createElement('H3');
    resultadoHeading.classList.add('text-center');
    resultadoHeading.textContent = recetas.length > 0 ? 'Resultados' : 'No hay resultados';
    resultadoContenedor.appendChild(resultadoHeading);

    recetas.forEach(receta => {
      let { idMeal, strMeal, strMealThumb } = receta;

      // Generar codigo HTML para las recetas
      const recetaContenedor = document.createElement('DIV');
      recetaContenedor.classList.add('col-md-4');

      const recetaCard = document.createElement('DIV');
      recetaCard.classList.add('card', 'mb-4');

      const recetaImagen = document.createElement('IMG');
      recetaImagen.classList.add('card-img-top');
      recetaImagen.alt = strMeal;
      recetaImagen.src = strMealThumb;

      const recetaCardBody = document.createElement('DIV');
      recetaCardBody.classList.add('card-body');

      const recetaHeading = document.createElement('DIV');
      recetaHeading.classList.add('card-title', 'mb-3');
      recetaHeading.textContent = strMeal;

      const recetaBoton = document.createElement('BUTTON');
      recetaBoton.classList.add('btn', 'btn-primary', 'w-100');
      recetaBoton.textContent = 'Ver receta';

      // Inyectar el codigo HTML	
      recetaCardBody.appendChild(recetaHeading);
      recetaCardBody.appendChild(recetaBoton);

      recetaCard.appendChild(recetaImagen);
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);
      resultadoContenedor.appendChild(recetaContenedor);

    });

    function limpiarHtml(elemento) {
      while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
      }
    }
  }

}


document.addEventListener('DOMContentLoaded', iniciarApp);