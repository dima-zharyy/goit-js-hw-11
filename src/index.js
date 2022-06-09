import './css/styles.css';
import getRefs from './js/getRefs';
// import fetchPictures from './js/fetchPictures';
import PicturesApiService from './js/additional-api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const picturesApiService = new PicturesApiService();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
  picturesApiService.updatePage();
  picturesApiService
    .fetchPictures()
    .then(data => {
      renderPictures(data);
      gallery.refresh();
    })
    .catch(error => error);
}

function onSubmit(event) {
  event.preventDefault();

  if (!event.currentTarget.elements.searchQuery.value) {
    Notify.failure('Query must be at least one letter!');
    return;
  }

  picturesApiService.query = event.currentTarget.elements.searchQuery.value;
  picturesApiService.resetPage();
  picturesApiService
    .fetchPictures()
    .then(data => {
      if (!data.total) {
        throw new Error(
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          )
        );
      } else {
        refs.gallery.innerHTML = '';
        renderPictures(data);
        gallery.refresh();
      }
    })
    .catch(error => error);
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
      <b>Likes</b><span>${new Intl.NumberFormat().format(likes)}</span>
    </p>
    <p class="gallery__info-item">
      <b>Views</b><span>${new Intl.NumberFormat().format(views)}</span>
    </p>
    <p class="gallery__info-item">
      <b>Comments</b><span>${new Intl.NumberFormat().format(comments)}</span>
    </p>
    <p class="gallery__info-item">
      <b>Downloads</b><span>${new Intl.NumberFormat().format(downloads)}</span>
    </p>
  </div>
</div>`;
}
