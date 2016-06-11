import hmacsha1 from 'hmacsha1';
import moment from 'moment';

const createSignature = (method, url, params, consumerSecret, accessSecret) => {
  const sortedKeys = Object.keys(params).sort();

  const paramsLength = sortedKeys.length;
  const initialString = '';
  const paramsString = sortedKeys.reduce((str, key, index) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(params[key]);

    return (index === paramsLength - 1)
      ? `${str}${encodedKey}=${encodedValue}`
      : `${str}${encodedKey}=${encodedValue}&`;
  }, initialString);

  const signatureData =
    `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramsString)}`;

  const signatureKey = (!accessSecret)
    ? `${consumerSecret}&`
    : `${consumerSecret}&${accessSecret}`;

  return hmacsha1(signatureKey, signatureData);
};

const createNonce = length => {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const createTimestamp = () => moment().unix();

export const createOauthHeader = ({
  method, url, params = {},
  consumerKey, consumerSecret, accessSecret,
}) => {
  const oauthParamsWithoutSignature = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: createNonce(32),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: createTimestamp().toString(),
    oauth_version: '1.0',
  };

  const finalParams = Object.assign({}, oauthParamsWithoutSignature, params);

  const signature = createSignature(method, url, finalParams, consumerSecret, accessSecret);

  const oauthParams = Object.assign({}, oauthParamsWithoutSignature, {
    oauth_signature: signature,
  });
  const oauthParamsLength = Object.keys(oauthParams).length;
  const initialString = 'OAuth ';

  return Object.keys(oauthParams)
    .sort()
    .reduce((str, key, index) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(oauthParams[key]);

      return (index === oauthParamsLength - 1)
        ? `${str}${encodedKey}="${encodedValue}"`
        : `${str}${encodedKey}="${encodedValue}", `;
    }, initialString);
};
