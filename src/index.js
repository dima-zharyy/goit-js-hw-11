import './css/styles.css';
import getRefs from './js/getRefs';
import { handlers } from './js/handlers';

const refs = getRefs();

refs.form.addEventListener('submit', handlers.onSubmit);
refs.loadMoreBtn.addEventListener('click', handlers.onLoadMore);
