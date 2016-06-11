import { fetchRequestToken } from './requests/fetchRequestToken';
import { authenticate } from './requests/authenticate';

/* eslint no-console: 0 */

fetchRequestToken()
  .then(result => authenticate(result))
  .then(result => console.log(result))
  .catch(err => console.error(err));
