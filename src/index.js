import './css/styles.css';
import getRefs from './js/getRefs';
import fetchPictures from './js/fetchPictures';
import throttle from 'lodash.throttle';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
const STORAGE_KEY = 'user-input-data';
let inputData = localStorage.getItem(STORAGE_KEY)
  ? JSON.parse(localStorage.getItem(STORAGE_KEY))
  : null;

refs.form.addEventListener('input', throttle(onUserInput, 300));
refs.form.addEventListener('submit', onSubmit);

populateUserInput();

function onSubmit(event) {
  event.preventDefault();

  fetchPictures(inputData)
    .then(data => {
      if (!data.total) {
        throw new Error(
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          )
        );
      }
      return data;
    })
    .then(data => {
      renderPictures(data);
      const gallery = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
    })
    .catch(error => error);

  event.currentTarget.reset();
  localStorage.removeItem(STORAGE_KEY);
  inputData = null;
}

function renderPictures(picturesData) {
  const markUp = picturesData.hits.map(createPictureMarkup).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
}

function createPictureMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}" class="gallery__link">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" />
  </a>
  <div class="gallery__info">
    <p class="gallery__info-item">
      <b>${likes}</b>
    </p>
    <p class="gallery__info-item">
      <b>${views}</b>
    </p>
    <p class="gallery__info-item">
      <b>${comments}</b>
    </p>
    <p class="gallery__info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`;
}

function onUserInput(event) {
  inputData = event.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inputData));
}

function populateUserInput() {
  if (!inputData) return;

  refs.form.elements.searchQuery.value = inputData;
}

// getPictures().then(data => {
//   const picture = data.hits[5].webformatURL;
//   const markUp = `<img src="${picture}">`;
//   refs.gallery.insertAdjacentHTML('beforeend', markUp);
// });
