const BASE_URL = 'https://restcountries.com/v3.1';
const END_POINT = '/name';

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
