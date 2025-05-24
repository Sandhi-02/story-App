import { getAccessToken } from '../utils/auth.js';
import { BASE_URL } from '../config.js';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  //STORY
  STORY_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORE_NEW_STORY: `${BASE_URL}/stories`,

  //STORY Comment
  STORY_COMMENTS_LIST: (storyId) => `${BASE_URL}/stories/${storyId}/comments`,
  STORE_NEW_STORY_COMMENT: (storyId) => `${BASE_URL}/stories/${storyId}/comments`,

  //STORY Comment
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  SEND_STORY_TO_ME: (storyId) => `${BASE_URL}/stories/${storyId}/notify-me`,
  SEND_STORY_TO_USER: (storyId) => `${BASE_URL}/stories/${storyId}/notify`,
  SEND_STORY_TO_ALL_USER: (storyId) => `${BASE_URL}/stories/${storyId}/notify-all`,
  SEND_COMMENT_TO_STORY_OWNER: (storyId, commentId) =>
    `${BASE_URL}/stories/${storyId}/comments/${commentId}/notify`,
};

console.log(ENDPOINTS.STORY_DETAIL());

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();
  // console.log(fetchResponse);

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();
  console.log(json);

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStorys() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_LIST, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();
  console.log(json);

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getStoryById(id) {
  const accessToken = getAccessToken();
  console.log(accessToken);

  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const json = await fetchResponse.json();
  console.log(json);

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewStory({ description, photo, lat, lon }) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.set('description', description);
  formData.set('lat', lat);
  formData.set('lon', lon);
  photo.forEach((poto) => {
    formData.append('photo', poto);
  });

  const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const json = await fetchResponse.json();
  // console.log(Response);

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllCommentsByStoryId(storyId) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_COMMENTS_LIST(storyId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // console.log(fetchResponse);
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
  console.log(json);
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
  });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
