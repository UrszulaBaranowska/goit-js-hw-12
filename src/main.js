import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const API_KEY = '44933716-9a3a9b2f063fdc3971bf0291b';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const loadMoreBtn = document.getElementById('load-more-btn');
let query = '';
let page = 1;
let totalHits = 0;

const fetchImages = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.status);
  }
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
  gallery.insertAdjacentHTML('beforeend', markup);
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

const showInfo = message => {
  iziToast.info({
    title: 'Info',
    message: message,
  });
};

const handleSearchFormSubmit = async event => {
  event.preventDefault();
  query = event.target.elements.query.value.trim();

  if (!query) return;

  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  loader.style.display = 'flex';
  page = 1;

  try {
    const data = await fetchImages(query, page);
    const images = data.hits;
    totalHits = data.totalHits;

    if (images.length === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    } else {
      displayImages(images);
      if (totalHits > images.length) {
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    showError('Something went wrong. Please try again later.');
  } finally {
    loader.style.display = 'none';
  }
};

const handleLoadMoreBtnClick = async () => {
  page += 1;
  loader.style.display = 'flex';

  try {
    const data = await fetchImages(query, page);
    const images = data.hits;

    if (images.length === 0) {
      loadMoreBtn.style.display = 'none';
      showInfo("We're sorry, but you've reached the end of search results.");
    } else {
      displayImages(images);
      if (page * 40 >= totalHits) {
        loadMoreBtn.style.display = 'none';
        showInfo("We're sorry, but you've reached the end of search results.");
      }

      const { height: cardHeight } = document
        .querySelector('.gallery-item')
        .getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    showError('Something went wrong. Please try again later.');
  } finally {
    loader.style.display = 'none';
  }
};

searchForm.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
