// import axios from 'axios';

// const BASE_URL = 'https://pixabay.com/api/';
// const searchParams = new URLSearchParams({
//   key: '27891054-2199c429fab30e58c22aa7ec7',
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: 'true',
//   per_page: '40',
//   page: '1',
// });

// export default async function fetchPictures(userQuery) {
//   try {
//     const response = await axios.get(
//       `${BASE_URL}?q=${userQuery}&${searchParams}`
//     );

//     const data = await response.data;
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }
