// These types are now based on the provided OpenAPI specification.

export interface Role {
  id: string;
  name: string;
}

// UserResponse schema
export interface User {
  id: string;
  username: string;
  email: string;
  // The backend response does not include roles, but they are part of UserCreation.
  // We keep it optional here for frontend use, but API calls must match the spec.
  roles?: Role[]; 
}

// CategoryResponse schema
export interface Category {
  id: string;
  name: string;
  description: string;
}

// MenuResponse schema
export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Renamed from 'price'
  status: 'AVAILABLE' | 'UNAVAILABLE';
  category: {
    id: string;
    name: string;
  };
  // 'imageUrl' is not in the OpenAPI spec for MenuResponse.
  // We'll add a placeholder on the frontend where needed.
}

export interface CartItem {
  product: Product;
  quantity: number;
}


// --- API Request/Response Types ---

// AuthenticationRequest schema
export interface AuthenticationRequest {
  username: string;
  password?: string;
}

// AuthenticationResponse schema (extracted from ApiResponse wrapper)
export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
  expiresIn: number;
}


// OrderCreationRequest schema
export interface OrderItemRequest {
  menuId: string;
  optionId?: string; // Optional based on schema
  quantity: number;
}

export interface CreateOrderRequest {
  userId: string;
  items: OrderItemRequest[];
}

// UserCreationRequest schema
export interface UserCreationRequest {
    username: string;
    email: string;
    password?: string;
    roles: string[];
}

// UserUpdateRequest schema
export interface UserUpdateRequest {
    email: string;
    roles: string[];
}

// MenuCreationRequest schema
export interface ProductCreationRequest {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string; // Corrected from categoryld
}

// MenuUpdateRequest schema
export type ProductUpdateRequest = ProductCreationRequest;

// CategoryCreationRequest schema
export interface CategoryCreationRequest {
  name: string;
  description: string;
}

// CategoryUpdateRequest schema
export type CategoryUpdateRequest = CategoryCreationRequest;
