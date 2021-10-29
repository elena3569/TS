import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import { getUserData, collectSearchFormData, getFavoritesAmount, renderToast } from './lib.js'

// localStorage.clear()
// window.localStorage.setItem('user', JSON.stringify({ userName: 'Kate', avatarUrl: '/img/avatar.png' }))
// window.localStorage.setItem('favoritesAmount', '1')

window.addEventListener('DOMContentLoaded', () => {

  const user = getUserData()
  const quantFavorites = getFavoritesAmount()

  renderUserBlock(user.userName, user.avatarUrl, quantFavorites)
  renderSearchFormBlock('2021-10-31')


  document.forms['search'].addEventListener('submit', collectSearchFormData.bind(this, event))

  renderSearchStubBlock()
  renderToast(
    { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
    { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  )
})