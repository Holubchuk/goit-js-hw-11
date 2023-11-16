import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './markup';
import { getImage } from './services-api';

const form = document.querySelector('.search-form');
const list = document.querySelector('.list');
const BtnLoad = document.querySelector('.load-more');
let currentPage = 1;
let query;

form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  currentPage = 1;
  const queryInput = form.elements.searchQuery;
  query = queryInput.value;

  try {
    await getImage(query, currentPage).then(data => {
      if (data.totalHits === 0 || query === '') {
        if (data.totalHits < 40) {
          BtnLoad.hidden = true;
        }
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
