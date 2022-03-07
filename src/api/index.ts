import axios from 'axios';

const tkdPreFix = 'https://www.talkingdata.com/app/rest/eventManagerV2';

export const getAllEvents = (
  {
    appToken,
    productId,
    platformIds,
    eventType,
    cookie,
  }: {
    appToken: string;
    productId: string;
    cookie: string;
    platformIds: string;
    eventType: 'calculating';
  }) => {
  return axios.get(`${tkdPreFix}/list/${appToken}?productId=${productId}&platformIds=${platformIds}&eventType=${eventType}`, {
    headers: {cookie},
  });
};

export const postAbandonEvent = (
  {
    appToken,
    productId,
    cookie,
    platformIds,
    eventIds,
  }: {
    appToken: string;
    productId: string;
    cookie: string;
    platformIds: string;
    eventIds: string[];
  }) => {
  return axios.post(`${tkdPreFix}/calculateToDiscard/${appToken}`, {
    productId,
    'eventIdMap': {[platformIds]: eventIds},
  }, {
    headers: {cookie},
  });
};
