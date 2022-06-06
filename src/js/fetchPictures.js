import axios from 'axios';

const BASE_URL_AND_KEY =
  'https://pixabay.com/api/?key=27891054-2199c429fab30e58c22aa7ec7';

export default async function getPictures() {
  try {
    const response = await axios.get(
      `${BASE_URL_AND_KEY}&q=dogs&image_type=photo&orientation=horizontal&safesearch=true`
    );
    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// export default async function fetchPictures() {
//   // axios.get(
//   //   `${BASE_URL_AND_KEY}&q=dogs&image_type=photo&orientation=horizontal&safesearch=true`
//   // );

//   return await fetch(
//     `${BASE_URL_AND_KEY}&q=dogs&image_type=photo&orientation=horizontal&safesearch=true`
//   );
// }
