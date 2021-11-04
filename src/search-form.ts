import { renderBlock, renderToast, SearchFormData } from './lib.js'
import { parseDate } from './parseDate.js'
import { collectSearchFormData, search } from './lib.js';
import { renderEmptyOrErrorSearchBlock, renderSearchResultsBlock } from './search-results.js';


export function renderSearchFormBlock(startDate?: string, endDate?: string) {

  const maxStartDate = parseDate(new Date((new Date()).getFullYear(), (new Date()).getMonth() + 2, 0), '-');

  if (endDate) {
    const date = startDate.split('-')
    if ((new Date()) >= (new Date(+date[0], +date[1] - 1, +date[2]))) {
      endDate = ''
    }
  }

  if (startDate) {
    const date = startDate.split('-')
    if ((new Date()) < (new Date(+date[0], +date[1] - 1, +date[2]))) {
      date[2] = (+date[2] + 2) < 10 ? '0' + (+date[2] + 2) : (+date[2] + 2).toString()
      endDate = endDate ? endDate : parseDate(new Date(+date[0], +date[1] - 1, +date[2]), '-')
    } else {
      startDate = ''
    }
  }

  if (!startDate) {
    const tomorrow = (new Date()).setDate((new Date()).getDate() + 1);
    startDate = parseDate(new Date(tomorrow), '-');

    if (!endDate) {
      endDate = parseDate(new Date((new Date(tomorrow)).setDate((new Date(tomorrow)).getDate() + 2)), '-');
    }
  }

  const date = startDate.split('-');
  const maxEndDate = parseDate(new Date(+date[0], +date[1] + 4, +date[2]), '-');


  renderBlock(
    'search-form-block',
    `
    <form name="search">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city"  type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${startDate}" min="${parseDate(new Date(), '-')}" max="${maxStartDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${endDate}" min="${parseDate(new Date(((new Date()).getDate() + 2)), '-')}" max="${maxEndDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <input type="checkbox" id="db" name="db"
                  checked>
            <label for="db">db-1</label>
          </div>

          <div>
            <input type="checkbox" id="sdk" name="sdk">
            <label for="sdk">SDK</label>
          </div>
          <div>
            <div><button id="search-button">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  const button = document.getElementById('search-button')
  
  
  if (button != null) {
    button.onclick = async function(event) {
      event.preventDefault()
      
      const searchData: SearchFormData = collectSearchFormData()
      if (searchData.city && searchData.startDate && searchData.endDate && searchData.maxPrice) {
        const result = await search(searchData)
        
        if (result.length > 0) {
          renderSearchResultsBlock(result)
        } else {
          renderEmptyOrErrorSearchBlock('Ничего не найдено')
        }
        
      } else {
        renderToast(
          { text: 'Заполните все поля формы', type: 'success' },
          { name: 'Понял', handler: () => { } }
        )
      }

    
    }
  }
}
