interface Action {
  name: string
  handler: () => void
}

interface Notice {
  text: string
  type: string
}

interface SearchFormData {
  city: string,
  startDate: string,
  endDate: string,
  maxPrice: number,
}

interface Place {
  place: string
}

type User = {
  userName: string
  avatarUrl: string
}

export function search(data: SearchFormData) {
  console.log(data);
}

export function collectSearchFormData() {
  // console.log(document.getElementById('check-in-date').value)
  const searchData: SearchFormData = {
    city: document.getElementById('city').value,
    startDate: document.getElementById('check-in-date').value,
    endDate: document.getElementById('check-out-date').value,
    maxPrice: document.getElementById('max-price').value,
  }
  search(searchData)
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
export function getFavoritesAmount() {
  const favoritesAmount: unknown = +localStorage.getItem('favoritesAmount')

  if (typeof favoritesAmount == 'number') {
    return favoritesAmount
  }
  return 0
}
