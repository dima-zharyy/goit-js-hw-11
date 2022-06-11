import getRefs from './getRefs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = getRefs();

export const additionalAPI = {
  handleIntersection(entries) {
    entries.map(entry => {
      if (entry.isIntersecting) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        observer.disconnect();
      }
    });
  },

  renderPictures(picturesData) {
    const markUp = picturesData.hits.map(this.createPictureMarkup).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markUp);
    gallery.refresh();
  },

  createPictureMarkup({
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
  },

  showLoadMoreBtn() {
    refs.loadMoreBtn.classList.remove('is-hidden');
  },

  hideLoadMoreBtn() {
    refs.loadMoreBtn.classList.add('is-hidden');
  },

  scrollBy() {
    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top:
        cardHeight * 3 -
        parseInt(window.getComputedStyle(refs.gallery).gridGap),
      behavior: 'smooth',
    });
  },
};

export const observer = new IntersectionObserver(
  additionalAPI.handleIntersection
);
