import { getFavoritesAmount, getUserData, Place, renderBlock } from './lib.js'
import { renderUserBlock } from './user.js'
type favoriteItem = {
  id: String,
  name: String,
  image: String,
}

export function renderSearchStubBlock () {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock (reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock (places: Place[]) {
  let resultList: string = ''
  const favoriteItems: favoriteItem[] = JSON.parse(localStorage.getItem('favoriteItems'))
  
  places.forEach(place => {
    resultList += `<li class="result">
    <div class="result-container">
      <div class="result-img-container">
        <div id=${place.id} class="favorites ${Boolean(favoriteItems.find(item => item.id == place.id)) ? 'active' : ''}"></div>
        <img class="result-img" src="${place.image}" alt="">
      </div>	
      <div class="result-info">
        <div class="result-info--header">
          <p>${place.name}</p>
          <p class="price">${place.price}&#8381;</p>
        </div>
        <div class="result-info--map"><i class="map-icon"></i> ${place.remoteness} км от вас</div>
        <div class="result-info--descr">${place.description}</div>
        <div class="result-info--footer">
          <div>
            <button>Забронировать</button>
          </div>
        </div>
      </div>
    </div>
  </li>`
  })
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${resultList}
    </ul>
    `
  )

  const favorites = document.getElementsByClassName("favorites")
  for(let i = 0; i < favorites.length; i++) {
    favorites[i].addEventListener('click', (e) => {
      const current = places.find(place => place.id == e.target.id)
      const isFavorite = Boolean(favoriteItems.find(item => item.id == current.id))
      
      if (!isFavorite) {
        favoriteItems.push({id: current.id, name: current.name, image: current.image})
      } else {
        favoriteItems.splice(favoriteItems.indexOf(favoriteItems.find(item => item.id == e.target.id)), 1)
      }
      
      localStorage.removeItem('favoriteItems')
      localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems))
      renderSearchResultsBlock(places)
      const user = getUserData()
      const quantFavorites = getFavoritesAmount()
      renderUserBlock(user.userName, user.avatarUrl, quantFavorites)
      
    })
  }
}
