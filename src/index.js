import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './markup';
import { getImage } from './services-api';

const form = document.querySelector('.search-form');
const list = document.querySelector('.list');
const BtnLoad = document.querySelector('.load-more');
let currentPage;
let query;
let perPage = 40;

form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  currentPage = 1;
  const queryInput = form.elements.searchQuery;
  query = queryInput.value.trim();

  try {
    await getImage(query, currentPage, perPage).then(data => {
      if (data.totalHits < perPage) {
        BtnLoad.hidden = true;
      } else {
        BtnLoad.hidden = false;
      }
      if (data.totalHits === 0 || !query) {
        list.innerHTML = '';
        BtnLoad.hidden = true;
        throw new Error();
      }

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
  getImage(query, currentPage, perPage)
    .then(data => {
      list.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      if (data.totalHits < currentPage * perPage) {
        BtnLoad.hidden = true;
      }
      let gallery = new SimpleLightbox('.gallery a');
      gallery.refresh();
    })
    .catch(err => console.log(err));
}
