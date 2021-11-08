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
  const current = places.find(place => place.id == e.target.id)
  
  if (!favoriteItems) {
    favoriteItems.push({id: current.id, name: current.title, image: current.photos[0]})
    return
  }

      const isFavorite = Boolean(favoriteItems.find(item => item.id == current.id))
      
      if (!isFavorite) {
        // favoriteItems.push({id: current.id, name: current.title, image: current.photos[0]})
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems.concat({id: current.id, name: current.title, image: current.photos[0]})))
      } else {
        // favoriteItems = favoriteItems.filter(item => item.id != e.target.id)
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems.filter(item => item.id != e.target.id)))
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
  const checkInDate = (document.getElementById('check-in-date').value).split('-')
  const checkOutDate = (document.getElementById('check-out-date').value).split('-')
  
  const searchData: SearchFormData = {
    city: document.getElementById('city').value,
    checkInDate: new Date(+checkInDate[0], +checkInDate[1], +checkInDate[2]),
    checkOutDate: new Date(+checkOutDate[0], +checkOutDate[1], +checkOutDate[2]),
    priceLimit: +document.getElementById('max-price').value,
  }
  return searchData
}


export function renderBlock(elementId, html) {
  const element = document.getElementById(elementId)
  element.innerHTML = html
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
      renderToast(null)
    }
  }
}


// Для обеих функций применить подход с unknown, чтобы валидировать содержимое localStorage. ????
export function getUserData() {
  const user: User = JSON.parse(localStorage.getItem('user'))
  return user

}
export function getFavoritesAmount(): number {
  
  const favoritesAmount = JSON.parse(localStorage.getItem('favoriteItems'))

  if (favoritesAmount) {
    return Object.keys(favoritesAmount).length
  }
  return 0
  
}
