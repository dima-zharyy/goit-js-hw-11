import axios from 'axios';
export default class PicturesApiService {
  static BASE_URL = 'https://pixabay.com/api/';
  static searchParams = new URLSearchParams({
    key: '27891054-2199c429fab30e58c22aa7ec7',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: '40',
  });

  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    try {
      const response = await axios.get(
        `${PicturesApiService.BASE_URL}?q=${this.searchQuery}&${PicturesApiService.searchParams}&page=${this.page}`
      );

      const data = await response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  showTotal() {}

  updatePage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
