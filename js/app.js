function iniciarApp() {


	obtenerCategorias()
	function obtenerCategorias() {
		let apiUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';
		return fetch(apiUrl)
			.then(resp => resp.json())
			.then(data => mostrarCategoria(data.categories))
			.catch(err => console.log(err));
	}

	function mostrarCategoria(categories=[]) {
		let selectEl = document.querySelector('#categoria');
		categories.map(category => {
			let opt = document.createElement('OPTION');
			opt.setAttribute('value', category.strCategory);
			opt.textContent = category.strCategory;
			selectEl.appendChild(opt);
		});
	}

}


document.addEventListener('DOMContentLoaded', iniciarApp);