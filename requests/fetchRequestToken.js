import fetch from 'isomorphic-fetch';
import { createOauthHeader } from '../oauth';
import { CONSUMER } from '../config';

/* eslint no-console: 0 */

const { key, secret } = CONSUMER;
export const fetchRequestToken = () => {
  const url = 'https://api.twitter.com/oauth/request_token';
  const method = 'GET';
  return fetch(url, {
    method,
    headers: {
      Authorization: createOauthHeader({
        method, url,
        consumerKey: key, consumerSecret: secret,
      }),
    },
  })
    .then(res => {
      if (!res.ok) throw new Error(`${res.staus}: ${res.statusText}`);
      return res.text();
    })
    .then(result => {
      const resultArray = result.split(/&/);
      return resultArray.reduce((prev, current) => {
        const keyAndValueArray = current.split(/=/);
        return (keyAndValueArray[0] === 'oauth_callback_confirmed')
          ? prev
          : Object.assign({}, prev, { [keyAndValueArray[0]]: keyAndValueArray[1] });
      }, {});
    })
    .catch(err => err.message || 'Something bad happened');
};
