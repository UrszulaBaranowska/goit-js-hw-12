import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '44933716-9a3a9b2f063fdc3971bf0291b';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

const fetchImages = query => {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};

const createImageMarkup = images => {
  return images
    .map(
      image => `
    <div class="gallery-item">
      <a href="${image.largeImageURL}" class="gallery-link">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
      </a>
      <div class="info">
        <p><strong>Likes:</strong> ${image.likes}</p>
        <p><strong>Views:</strong> ${image.views}</p>
        <p><strong>Comments:</strong> ${image.comments}</p>
        <p><strong>Downloads:</strong> ${image.downloads}</p>
      </div>
    </div>
  `
    )
    .join('');
};

const displayImages = images => {
  const markup = createImageMarkup(images);
  gallery.innerHTML = markup;
  const lightbox = new SimpleLightbox('.gallery-link', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
  lightbox.refresh();
};

const showError = message => {
  iziToast.error({
    title: 'Error',
    message: message,
  });
};

const handleSearchFormSubmit = async event => {
  event.preventDefault();
  const query = event.target.elements.query.value.trim();

  if (!query) return;

  gallery.innerHTML = '';
  loader.style.display = 'flex';

  try {
    const data = await fetchImages(query);
    const images = data.hits;

    if (images.length === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    } else {
      displayImages(images);
    }
  } catch (error) {
    showError('Something went wrong. Please try again later.');
  } finally {
    loader.style.display = 'none';
  }
};

searchForm.addEventListener('submit', handleSearchFormSubmit);