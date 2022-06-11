import getRefs from './getRefs';
import PicturesApiService from './picturesApiService';
import { additionalAPI } from './additional-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { observer } from './additional-api';

const refs = getRefs();
const picturesApiService = new PicturesApiService();

export const handlers = {
  onLoadMore() {
    picturesApiService.updateHitsCounter();
    picturesApiService.updatePage();
    picturesApiService
      .fetchPictures()
      .then(data => {
        additionalAPI.renderPictures(data);

        if (picturesApiService.hitsCounter >= picturesApiService.totalHits) {
          observer.observe(refs.loadMoreBtn);
          additionalAPI.hideLoadMoreBtn();
        }
      })
      .catch(error => error);
  },

  onSubmit(event) {
    event.preventDefault();

    additionalAPI.hideLoadMoreBtn();
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
          additionalAPI.renderPictures(data);
          additionalAPI.showLoadMoreBtn();
          Notify.success(`Hooray! We found ${data.totalHits} images.`);

          if (picturesApiService.hitsCounter >= picturesApiService.totalHits) {
            observer.observe(refs.loadMoreBtn);
            additionalAPI.hideLoadMoreBtn();
          }
        }
      })
      .catch(error => error);
  },
};
