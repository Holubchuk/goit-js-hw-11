import Notiflix from 'notiflix';
import axios from 'axios';

export async function getImage(query, page) {
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