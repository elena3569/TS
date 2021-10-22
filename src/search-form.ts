import { renderBlock } from './lib.js'
import { parseDate } from './parseDate.js'


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
  const minEndDate = parseDate(new Date(+date[0], +date[1], +date[2] + 1), '-');
  const maxEndDate = parseDate(new Date(+date[0], +date[1] + 4, +date[2]), '-');


  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
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
            <input id="check-out-date" type="date" value="${endDate}" min="${minEndDate}" max="${maxEndDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
