import axios from 'axios';

const API_KEY = '51458279-4e6b2a3cff5506a1c0eebb844';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: 15,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}