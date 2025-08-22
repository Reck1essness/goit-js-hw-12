import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter your search query.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();

  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    iziToast.success({
      message: `We found ${totalHits} images.`,
      position: 'topRight',
    });

    createGallery(data.hits);

    if (totalHits > 15) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something gone wrong. Please try again later!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;

  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    scrollGallery();

    const totalPages = Math.ceil(totalHits / 15);
    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: 'Sorry, you have reached the end of the search results.',
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Could not load more images. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function scrollGallery() {
  const galleryItem = document.querySelector('.gallery li');
  if (galleryItem) {
    const { height: cardHeight } = galleryItem.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

hideLoadMoreButton();
hideLoader();