import { fetchCountries } from './js/fetchCountries';
import { countryСardTeemplate, countryListTemplate } from './js/markupTemplate';
import { refs } from './js/refs';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import 'notiflix/dist/notiflix-3.2.5.min.css';
import './css/styles.css';
import './css/markup-styles.css';

const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener(
  'input',
  debounce(onInputCountry, DEBOUNCE_DELAY)
);

function onInputCountry(e) {
  const countryName = refs.searchBox.value;
  if (countryName === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        return;
      }

      if (countries.length <= 10) {
        const listMarkup = countries.map(country =>
          countryListTemplate(country)
        );
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        const markup = countries.map(country => countryСardTeemplate(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      return error;
    });
}
