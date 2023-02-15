import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
    
const DEBOUNCE_DELAY = 300;

const refs = {
 inputEl: document.getElementById('search-box'),
 listEl: document.querySelector('.country-list'),
 infoEl: document.querySelector('.country-info'),}

const cleanMarkup = ref => (ref.innerHTML = '');

const onInput = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(refs.listEl);
    cleanMarkup(refs.infoEl);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info('Занадто багато співпадінь. Будь ласка, введіть більше інформації!');
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(refs.listEl);
      cleanMarkup(refs.infoEl);
      Notify.failure('Вибачте, така країна відсутня!');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(refs.listEl);
    const markupInfo = createInfoMarkup(data);
    refs.infoEl.innerHTML = markupInfo;
  } else {
    cleanMarkup(refs.infoEl);
    const markupList = createListMarkup(data);
    refs.listEl.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));