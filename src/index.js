import './css/styles.css';
import Notiflix from 'notiflix';
// import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchQuery = searchBox.value.trim();

  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length > 1) {
        renderCountryList(countries);
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      } else {
        clearMarkup();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, something went wrong!');
    });
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
  clearMarkup();
  const markup = countries.map(country => `<li>${country.name.official}</li>`).join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo(country) {
  clearMarkup();
  const markup = `
    <h2>${country.name.official}</h2>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <img src="${country.flags.svg}" alt="Flag of ${country.name.official}">
    <p>Languages: ${country.languages.map(lang => lang.name).join(', ')}</p>
  `;
  countryInfo.insertAdjacentHTML('beforeend', markup);
}