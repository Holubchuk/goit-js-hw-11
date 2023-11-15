export function createMarkup(searchData) {
    return searchData
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<li class="item"><div class="photo-card">
          <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes <span class="span">${likes}</span></b>
          </p>
          <p class="info-item">
            <b>Views <span class="span">${views}</span></b>
          </p>
          <p class="info-item">
            <b>Comments <span class="span">${comments}</span></b>
          </p>
          <p class="info-item">
            <b>Downloads <span class="span">${downloads}</span></b>
          </p>
        </div>
      </div></li>`
      )
      .join('');
  }
  