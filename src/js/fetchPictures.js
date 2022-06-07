import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const options = [
  'key=27891054-2199c429fab30e58c22aa7ec7',
  'image_type=photo',
  'orientation=horizontal',
  'safesearch=true',
];

export default async function fetchPictures(userQuery) {
  try {
    const response = await axios.get(
      `${BASE_URL}?q=${userQuery}&${options.join('&')}`
    );

    const data = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    Notify.failure(`Someone wrote incorrect code :)`);
  }
}