export interface Category {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Product {
  _id: string
  id: string
  title: string
  slug: string
  description: string
  quantity: number
  sold: number
  price: number
  priceAfterDiscount?: number
  imageCover: string
  images: string[]
  category: Category
  brand: Brand
  subcategory?: Category[]
  ratingsAverage: number
  ratingsQuantity: number
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  results?: number
  metadata?: {
    currentPage: number
    numberOfPages: number
    limit: number
  }
  data: T
  status?: string
  message?: string
}

export interface CartItem {
  _id: string
  price: number
  count: number
  product: Product
}

export interface Cart {
  _id: string
  cartOwner: string
  products: CartItem[]
  totalCartPrice: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export interface Order {
  shippingAddress?: {
    details: string
    phone: string
    city: string
  }
  taxPrice: number
  shippingPrice: number
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  _id: string
  user: {
    _id: string
    name: string
    email: string
    phone: string
  }
  cartItems: CartItem[]
  createdAt: string
  updatedAt: string
  id: number
}