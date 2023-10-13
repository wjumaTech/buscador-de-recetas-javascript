function iniciarApp() {


  const selectEl = document.querySelector('#categoria');

  if (selectEl) {
    selectEl.addEventListener('change', seleccionarCategoria, false);
    obtenerCategorias();
  }

  const resultadoContenedor = document.querySelector('#resultado');

  const favoritosDiv = document.querySelector('.favoritos');

  if (favoritosDiv) {
    obtenerFavoritos();
  }

  // Bootstrap
  const modal = new bootstrap.Modal(
    document.querySelector('.modal'),
    {}
  )


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
      recetaImagen.alt = strMeal ?? receta.title;
      recetaImagen.src = strMealThumb ?? receta.image;

      const recetaCardBody = document.createElement('DIV');
      recetaCardBody.classList.add('card-body');

      const recetaHeading = document.createElement('DIV');
      recetaHeading.classList.add('card-title', 'mb-3');
      recetaHeading.textContent = strMeal ?? receta.title;

      const recetaBoton = document.createElement('BUTTON');
      recetaBoton.classList.add('btn', 'btn-primary', 'w-100');
      recetaBoton.textContent = 'Ver receta';
      recetaBoton.addEventListener('click', () => {
        const id = idMeal ?? receta.id;
        seleccionarReceta(id);
      });

      // Inyectar el codigo HTML	
      recetaCardBody.appendChild(recetaHeading);
      recetaCardBody.appendChild(recetaBoton);

      recetaCard.appendChild(recetaImagen);
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);
      resultadoContenedor.appendChild(recetaContenedor);

    });

  }

  function seleccionarReceta( recetaId='' ) {
    const apiUrl = `https://themealdb.com/api/json/v1/1/lookup.php?i=${recetaId}`;

    console.log(apiUrl)
    fetch(apiUrl)
      .then(resp => resp.json())
      .then(result => mostrarRecetaModal(result.meals[0]))
      .catch(err => console.log(err));
  }

  function mostrarRecetaModal(receta={}) {

    const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

    // Generar HTML e inyectar a DOM
    const modalHeading = document.querySelector('.modal .modal-title')
    const modalBody = document.querySelector('.modal .modal-body')

    modalHeading.textContent = strMeal;
    modalBody.innerHTML = `
      <img class="img-fluid" src="${strMealThumb}" />
      <h3 class="mt-3">Instrucciones</h3>
      <p>${strInstructions}</p>
      <h3>Ingresientes</h3>
    `


    const listGroup = document.createElement('UL');
    listGroup.classList.add('list-group');

    // Ingresientes
    for( let i = 1; i <= 20; i++ ) {
      if( receta[`strIngredient${i}`] ) {



        const listItem = document.createElement('LI');
        listItem.classList.add('list-group-item');
        listItem.textContent = receta[`strIngredient${i}`] +" - "+ receta[`strMeasure${i}`]

        listGroup.appendChild(listItem);
      }
    }

    modalBody.appendChild(listGroup);

    const modalFooter = document.querySelector('.modal-footer');
    limpiarHtml(modalFooter);

    // Botondes de cerrar y favorito
    const btnFavorito = document.createElement('BUTTON');
    btnFavorito.classList.add('btn', 'btn-primary', 'col');
    btnFavorito.textContent = existeFavorito(idMeal) ? 'Eliminar favorito' :'Guardar favorito';
    btnFavorito.onclick = function() {

      if( existeFavorito(idMeal) ) {
        eleminarFavorito(idMeal);
        btnFavorito.textContent = "Guardar favorito";
        mostrarToast(`Eliminado correctamente`, strMeal);
        return;
      }

      agregarFavorito({
        id: idMeal,
        title: strMeal,
        image: strMealThumb
      });

      btnFavorito.textContent = "Eliminar favorito";
      mostrarToast(`Se ha agregado a favorito`, strMeal);
    }

    const btnCerrarModal = document.createElement('BUTTON');
    btnCerrarModal.classList.add('btn', 'btn-secondary', 'col');
    btnCerrarModal.textContent = 'Cerrar';
    btnCerrarModal.onclick = function() {
      modal.hide();
    };


    modalFooter.appendChild(btnFavorito);
    modalFooter.appendChild(btnCerrarModal);

    
    // TODO: Open modal
    modal.show();
  }
  
  function agregarFavorito( receta={} ) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
  }

  function existeFavorito( id='' ) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    return favoritos.some(f => f.id === id);
  }

  function eleminarFavorito( id='' ) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    const nuevosFavoritos = favoritos.filter(f => f.id !== id);
    localStorage.setItem('favoritos', JSON.stringify([...nuevosFavoritos]));
  }

  function mostrarToast( mensaje='', title='' ) {

    const toastContainer = document.querySelector('.toast');
    const toastBody = document.querySelector('.toast-body');
    const toastTitle = document.querySelector('.toast-title');

    const toast = new bootstrap.Toast(toastContainer);

    toastTitle.textContent = title;
    toastBody.textContent = mensaje;

    toast.show();
  }

  function obtenerFavoritos() {
    const favoritos = JSON.parse( localStorage.getItem('favoritos') ) ?? [];

    console.log(favoritos)

    if (favoritos.length) {
      mostrarRecetas(favoritos);
      return;
    }
    
    const noFavoritos = document.createElement('P');
    noFavoritos.textContent = 'No hay favoritos';
    noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
    favoritosDiv.appendChild(noFavoritos);
  }

  function limpiarHtml(elemento) {
    while (elemento.firstChild) {
      elemento.removeChild(elemento.firstChild);
    }
  }

}


document.addEventListener('DOMContentLoaded', iniciarApp);