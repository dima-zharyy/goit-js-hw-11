import './css/styles.css';
import getRefs from './js/getRefs';
import PicturesApiService from './js/picturesApiService';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const picturesApiService = new PicturesApiService();

///////////////////////////////////////////////////////////

function handleIntersection(entries) {
  entries.map(entry => {
    if (entry.isIntersecting) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      observer.disconnect();
    }
  });
}

const observer = new IntersectionObserver(handleIntersection);

///////////////////////////////////////////////////////////

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
  if (picturesApiService.hitsCounter >= picturesApiService.totalHits) {
    observer.observe(refs.loadMoreBtn);
    return;
  }

  picturesApiService.updateHitsCounter();
  picturesApiService.updatePage();
  picturesApiService
    .fetchPictures()
    .then(renderPictures)
    .catch(error => error);
}

function onSubmit(event) {
  event.preventDefault();

  hideLoadMoreBtn();
  refs.gallery.innerHTML = '';

  if (!event.currentTarget.elements.searchQuery.value) {
    Notify.failure('Query must be at least one letter!');
    return;
  }

  picturesApiService.query = event.currentTarget.elements.searchQuery.value;
  picturesApiService.resetHitsCounter();
  picturesApiService.updateHitsCounter();
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
        renderPictures(data);
        showLoadMoreBtn();
      }
    })
    .catch(error => error);
}

function renderPictures(picturesData) {
  const markUp = picturesData.hits.map(createPictureMarkup).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
  gallery.refresh();
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

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

observer.observe(refs.loadMoreBtn);
