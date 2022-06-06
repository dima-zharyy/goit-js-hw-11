import fetchPictures from './js/fetchPictures';
import getRefs from './js/getRefs';
import getPictures from './js/fetchPictures';

const refs = getRefs();

getPictures().then(data => {
  const picture = data.hits[0];
  console.log(picture);
  const markUp = `<img src="${picture}">`;
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
});

// fetchPictures()
//   .then(response => response.json())
//   .then(data => {
//     const picture = data.hits[0].pageURL;
//     const markUp = `<img src="${picture}">`;
//     refs.gallery.insertAdjacentHTML('beforeend', markUp);
//   });
