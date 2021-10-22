import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import { renderToast } from './lib.js'

const userName = 'Ann'
const imgUrl = '/img/avatar.png'
const quantFavorites = 0

window.addEventListener('DOMContentLoaded', () => {
  renderUserBlock(userName, imgUrl, quantFavorites)
  renderSearchFormBlock('2021-10-31')
  renderSearchStubBlock()
  renderToast(
    { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
    { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  )
})
