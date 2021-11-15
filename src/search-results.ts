import { Place } from 'flat-rent-sdk'
import { FavoriteItem, renderBlock, sort, toggleFavoriteItem } from './lib.js'

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

export function renderEmptyOrErrorSearchBlock (reasonMessage: string) {
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

export function renderSearchResultsBlock (places: Place[], selectedValue?: string) {
  let resultList: string = ''
  const localStor: unknown = localStorage.getItem('favoriteItems')
  const favoriteItems: FavoriteItem[] = []
  if (typeof localStor === 'string') {
    let items: FavoriteItem[] = JSON.parse(localStor)
    items.forEach(item => {
      favoriteItems.push(item)
    });
  }

  
  
  const options = {
    cheaper: "cheaper",
    expensive: "expensive",
    nearer: "nearer"
  }

  places.forEach(place => {
    // let photosHtml = ''
    // place.photos.forEach(photo => {
    //   photosHtml += `<img class="result-img" src="${photo}" alt="">`
    // })
    resultList += `<li class="result">
    <div class="result-container">
      <div class="result-img-container">
        <div id=${place.id} class="favorites ${Boolean(favoriteItems?.find(item => item.id == place.id)) ? 'active' : ''}"></div>
        <img class="result-img" src="${place.photos[0]}" alt="">
      </div>	
      <div class="result-info">
        <div class="result-info--header">
          <p>${place.title}</p>
          <p class="price">${place.price}&#8381; /сутки</p>
          <p class="price">${place.totalPrice}&#8381;</p>
        </div>
        <div class="result-info--map"><i class="map-icon"></i> ${place.remoteness} км от вас</div>
        <div class="result-info--descr">${place.details}</div>
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
            <select id="select">
            <option value='' ${selectedValue ? '' : 'selected'}></option>
            <option value='${options.expensive}' ${selectedValue == options.expensive ? 'selected' : ''}>Сначала дорогие</option>
            <option value='${options.nearer}' ${selectedValue == options.nearer ? 'selected' : ''}>Сначала ближе</option>
            <option value='${options.cheaper}' ${selectedValue == options.cheaper ? 'selected' : ''}>Сначала дешёвые</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${resultList}
    </ul>
    `
  )

  const selectEl = document.getElementById('select')
  if (selectEl instanceof HTMLElement) {
    selectEl.addEventListener('change', e => {
      const target = e.target
      if (target instanceof EventTarget && target.hasOwnProperty('value')) {
        sort(target.value, places); 
      }
    })
  }

  const favorites = document.getElementsByClassName("favorites")
  for(let i = 0; i < favorites.length; i++) {
    favorites[i].addEventListener('click', e => {
      toggleFavoriteItem(e, places, favoriteItems)
    })
  }
}
