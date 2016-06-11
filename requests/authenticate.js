import fetch from 'isomorphic-fetch';

export const authenticate = ({ oauth_token: oauthToken }) => {
  const url = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
  const method = 'GET';
  return fetch(url, {
    method,
  })
    .then(res => {
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.text();
    })
    .catch(err => err.message || 'Something bad happened');
};
