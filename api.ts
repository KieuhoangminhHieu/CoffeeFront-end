import { 
  AuthenticationRequest, 
  AuthenticationResponse, 
  Category, 
  CreateOrderRequest, 
  Product, 
  User,
  ProductCreationRequest,
  ProductUpdateRequest,
  CategoryCreationRequest,
  CategoryUpdateRequest,
  UserCreationRequest,
  UserUpdateRequest,
} from './types';

// CORRECT BASE URL based on OpenAPI spec
const API_BASE_URL = 'http://localhost:8080/coffee';

interface ApiResponse<T> {
  result: T;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    // Backend seems to wrap errors differently, so we check for a specific structure
    const errorMessage = errorData.error?.message || errorData.message || 'An unknown error occurred';
    throw new Error(errorMessage);
  }
  if (response.status === 204) { // No Content
    return null as T;
  }
  // UNWRAP the 'result' property from the response body, as per OpenAPI spec
  const apiResponse: ApiResponse<T> = await response.json();
  return apiResponse.result;
}

// Auth
// Corrected endpoint from /auth/authenticate to /auth/token
export const login = (credentials: AuthenticationRequest): Promise<AuthenticationResponse> => {
  return fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(handleResponse<AuthenticationResponse>);
};

// Corrected register to POST /users
export const register = (userData: UserCreationRequest): Promise<User> => {
  return fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(handleResponse<User>);
};

// Corrected endpoint from /users/me to /users/myInfo
export const getCurrentUserInfo = (token: string): Promise<User> => {
  return fetch(`${API_BASE_URL}/users/myInfo`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse<User>);
};

// Admin - Users
export const getUsers = (token: string): Promise<User[]> => {
  return fetch(`${API_BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse<User[]>);
};

export const createUser = (userData: UserCreationRequest, token: string): Promise<User> => {
    return fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    }).then(handleResponse<User>);
}

export const updateUser = (userId: string, userData: UserUpdateRequest, token: string): Promise<User> => {
  return fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  }).then(handleResponse<User>);
};

export const deleteUser = (userId: string, token: string): Promise<void> => {
  return fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(response => {
     if (!response.ok) {
        // We don't use handleResponse here as delete might not return a body
        throw new Error('Failed to delete user');
     }
  });
};


// Products
// Corrected endpoint from /menu to /menus
export const getProducts = (): Promise<Product[]> => {
  return fetch(`${API_BASE_URL}/menus`).then(handleResponse<Product[]>);
};

export const createProduct = (productData: ProductCreationRequest, token: string): Promise<Product> => {
  return fetch(`${API_BASE_URL}/menus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  }).then(handleResponse<Product>);
};

// Corrected path parameter name from productId to menuId
export const updateProduct = (menuId: string, productData: ProductUpdateRequest, token: string): Promise<Product> => {
  return fetch(`${API_BASE_URL}/menus/${menuId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  }).then(handleResponse<Product>);
};

// Corrected path parameter name from productId to menuId
export const deleteProduct = (menuId: string, token: string): Promise<void> => {
  return fetch(`${API_BASE_URL}/menus/${menuId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(response => {
    if (!response.ok) throw new Error('Failed to delete product');
  });
};

// Categories
// Corrected endpoint from /category to /categories
export const getCategories = (): Promise<Category[]> => {
  return fetch(`${API_BASE_URL}/categories`).then(handleResponse<Category[]>);
};

export const createCategory = (categoryData: CategoryCreationRequest, token: string): Promise<Category> => {
  return fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  }).then(handleResponse<Category>);
};

export const updateCategory = (categoryId: string, categoryData: CategoryUpdateRequest, token: string): Promise<Category> => {
  return fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  }).then(handleResponse<Category>);
};

export const deleteCategory = (categoryId: string, token: string): Promise<void> => {
  return fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(response => {
    if (!response.ok) throw new Error('Failed to delete category');
  });
};

// Orders
export const createOrder = (orderData: CreateOrderRequest, token: string): Promise<any> => {
  return fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  }).then(handleResponse);
};
