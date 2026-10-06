import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error);
  }
);

export const registerUser = (body: { fullname: string; email: string; password: string }): Promise<any> =>
  api.post('/user/register', body);

export const loginUser = (body: { email: string; password: string }): Promise<any> =>
  api.post('/user/login', body);

export const registerFoodPartner = (body: { fullname: string; email: string; password: string }): Promise<any> =>
  api.post('/foodpartner/register', body);

export const loginFoodPartner = (body: { email: string; password: string }): Promise<any> =>
  api.post('/foodpartner/login', body);

export const listFood = (): Promise<any> =>
  api.get('/list-food');

export const getFoodPartnerById = (id: string | number): Promise<any> =>
  api.get(`/foodpartner/${id}`);

export const addFood = (formData: FormData): Promise<any> =>
  api.post('/add-food', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const likeFood = (foodId: string | number): Promise<any> =>
  api.post(`/like-food/${foodId}`);

export const removeFood = (id: string | number): Promise<any> =>
  api.delete(`/remove-food/${id}`);

export default api;