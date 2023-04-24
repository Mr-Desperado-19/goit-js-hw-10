import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const BASE_URL = 'https://restcountries.com/v3.1';
const END_POINT = '/name';

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

async function onSearch(event) {
  const name = event.target.value.trim();

  if (!name) {
    clearResults();
    return;
  }

  try {
    const countries = await fetchCountries(name);

    if (countries.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      clearResults();
      return;
    }

    if (countries.length >= 2 && countries.length <= 10) {
      renderCountryList(countries);
      clearCountryInfo();
      return;
    }

    if (countries.length === 1) {
      renderCountryInfo(countries[0]);
      clearCountryList();
      return;
    }

    Notiflix.Notify.info('Oops, there is no country with that name.');
    clearResults();
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Failed to fetch countries');
  }
}

async function fetchCountries(name) {
  const url = `${BASE_URL}${END_POINT}/${name}?fields=name,capital,population,flags,languages`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Country not found: ${name}`);
    }
    throw new Error(`Failed to fetch countries: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

function renderCountryList(countries) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  const countryListItems = countries.map((country) => {
    const { name: { official }, flags: { svg } } = country;

    return `
      <li>
        <img src="${svg}" alt="${official} flag" width="50">
        <span>${official}</span>
      </li>
    `;
  });

  countryList.innerHTML = countryListItems.join('');
}

function renderCountryInfo(country) {
  const { name: { official }, capital, population, flags: { svg }, languages } = country;

  countryInfo.innerHTML = `
    <h2>${official}</h2>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${languages}</p>
    <img src="${svg}" alt="${official} flag" width="200">
  `;
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

function clearResults() {
  clearCountryList();
  clearCountryInfo();
}

export { fetchCountries };