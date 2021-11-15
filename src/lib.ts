import { FlatRentSdk } from './flat-rent-sdk.js'
import { Place } from 'flat-rent-sdk'
import { renderEmptyOrErrorSearchBlock, renderSearchResultsBlock } from './search-results.js'
import { renderUserBlock } from './user.js'

export interface FavoriteItem {
  id: String,
  name: String,
  image: String,
}

interface Action {
  name: string
  handler: () => void
}

interface Notice {
  text: string
  type: string
}

export interface SearchFormData {
  city: string,
  checkInDate: Date,
  checkOutDate: Date,
  priceLimit: number,
}

interface User {
  userName: string
  avatarUrl: string
}

export function sort(value: string, places: Place[]) {
  if (value === 'nearer') {
    renderSearchResultsBlock(places.sort((a: Place, b: Place) => {
      if(a.remoteness < b.remoteness) {
        return -1
      }
      if(a.remoteness > b.remoteness) {
        return 1
      }
      return 0
    }), value)
    return
  }
  if (value === 'expensive') {
    renderSearchResultsBlock(places.sort((a: Place, b: Place) => {
      if(a.price > b.price) {
        return -1
      }
      if(a.price < b.price) {
        return 1
      }
      return 0
    }), value)
    return
  }
  if (value === 'cheaper') {
    renderSearchResultsBlock(places.sort((a: Place, b: Place) => {
      if(a.price < b.price) {
        return -1
      }
      if(a.price > b.price) {
        return 1
      }
      return 0
    }), value)
    return
  }
}

export function toggleFavoriteItem(e: Event, places: Place[], favoriteItems: FavoriteItem[]) {
  
  const target = e.target
      if (target instanceof EventTarget && target.hasOwnProperty('id')) {
  
    const current = places.find(place => place.id == target.id)
    
    if (typeof current === 'object' && 'id' in current && 'title' in current && 'photos' in current) {
      favoriteItems.push({id: current.id, name: current.title, image: current.photos[0]})
      const isFavorite = Boolean(favoriteItems.find(item => item.id == current.id))
      if (!isFavorite) {
        // favoriteItems.push({id: current.id, name: current.title, image: current.photos[0]})
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems.concat({id: current.id, name: current.title, image: current.photos[0]})))
      } else {
        // favoriteItems = favoriteItems.filter(item => item.id != e.target.id)
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems.filter(item => item.id != target.id)))
      }
    }
    
  }
      
      
      renderSearchResultsBlock(places)
      const user = getUserData()
      renderUserBlock(user.userName, user.avatarUrl, getFavoritesAmount())
}

export async function search(searchData: SearchFormData): Promise<Place[]> {
  const url = 'http://localhost:3000/places'
  
  const places: Place[] = []
  
  await fetch(url)
  .then(response => response.json())
  .then(data => {
    
    Object.values(data).forEach(el => {
      places.push(el)
    })
    
  })
  .catch(err => {
    console.log(err);
    renderEmptyOrErrorSearchBlock('Произошла ошибка')
    
  })
  
  const sdk = new FlatRentSdk()
  return sdk.search(places.concat(...sdk.database), searchData);
}

export function collectSearchFormData() {
  const searchData: SearchFormData = {
    city: '',
    checkInDate: new Date(),
    checkOutDate: new Date(),
    priceLimit: 0,
  }
  const checkInDateEl = document.getElementById('check-in-date')
  const checkOutDateEl = document.getElementById('check-out-date')
  const cityEl = document.getElementById('city')
  const priceEl = document.getElementById('price')
  
  if (checkInDateEl instanceof HTMLElement && 'value' in checkInDateEl){
    const checkInDate = (checkInDateEl.value).split('-')
    searchData.checkInDate = new Date(+checkInDate[0], +checkInDate[1], +checkInDate[2])
  }
  if (checkOutDateEl instanceof HTMLElement && 'value' in checkOutDateEl){
    const checkOutDate = (checkOutDateEl.value).split('-')
    searchData.checkOutDate = new Date(+checkOutDate[0], +checkOutDate[1], +checkOutDate[2])
  }
  if (cityEl instanceof HTMLElement && 'value' in cityEl){
    searchData.city = cityEl.value
  }
  if (priceEl instanceof HTMLElement && 'value' in priceEl){
    searchData.priceLimit = +priceEl.value
  }

  
  return searchData
}


export function renderBlock(elementId: string, html: string) {
  const element = document.getElementById(elementId)
  if (element instanceof HTMLElement) {
    element.innerHTML = html
  }
}

export function renderToast(message: Notice, action?: Action) {
  let messageText = ''

  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || 'Закрыть'}</button>
      </div>
    `
  }

  renderBlock(
    'toast-block',
    messageText
  )

  const button = document.getElementById('toast-main-action')
  if (button != null) {
    button.onclick = function () {
      if (action != null && action.handler != null) {
        action.handler()
      }
      renderToast({text: '', type: ''})
    }
  }
}


// Для обеих функций применить подход с unknown, чтобы валидировать содержимое localStorage. ????
export function getUserData(): User {
  const localStor = localStorage.getItem('user')
  if (typeof localStor === 'string'){
    const user: unknown = JSON.parse(localStor)
    if (user instanceof Object) {
      if ('userName' in user && 'avatarUrl' in user) {

        return user
      }
    }
  }
  return {userName: '', avatarUrl: ''}
}
export function getFavoritesAmount(): number {
  
  const favoritesAmount = localStorage.getItem('favoriteItems')

  const localStor = localStorage.getItem('favoriteItems')
  if (typeof localStor === 'string'){
    const favoritesAmount: unknown = JSON.parse(localStor)
    if (favoritesAmount instanceof Array) {
      return Object.keys(favoritesAmount).length
    }
  }

  return 0
  
}
