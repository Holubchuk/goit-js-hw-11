import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { createMarkup } from './markup';

const form = document.querySelector('.search-form');
const list = document.querySelector('.list');
const BtnLoad = document.querySelector('.load-more');
const axios = require('axios');
let currentPage = 1;
let query;

async function getImage(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '40632691-213f7517e31f589a015673005';

  const params = {
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return await response.data;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
}

form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  currentPage = 1;
  const queryInput = form.elements.searchQuery;
  query = queryInput.value;

  try {
    await getImage(query, currentPage).then(data => {
      if (data.total === 0 || query === '') {
        list.innerHTML = '';
        BtnLoad.hidden = true;
        throw new Error();
      }

      BtnLoad.hidden = false;
      list.innerHTML = createMarkup(data.hits);

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);

      let lightbox = new SimpleLightbox('.photo-card a', {
        captionsData: 'alt',
        captionDelay: 250,
        scrollZoom: false,
      });

      return data;
    });
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
}

BtnLoad.addEventListener('click', onLoad);

function onLoad() {
  currentPage += 1;
  getImage(query, currentPage)
    .then(data => {
      list.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      if (data.totalHits <= currentPage * 40) {
        BtnLoad.hidden = true;
      } else {
        BtnLoad.hidden = false;
      }
      let gallery = new SimpleLightbox('.gallery a');
      gallery.refresh();
    })
    .catch(err => console.log(err));
}