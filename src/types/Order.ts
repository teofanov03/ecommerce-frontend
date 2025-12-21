// src/types/Order.ts

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

// 1. Definišemo poseban interfejs za Product kako bi kod bio čistiji
export interface OrderProduct {
  _id: string;
  name: string;
  image?: string;
  category?: string; // DODATO: Ovo je rešilo grešku za "category"
}

export interface OrderItem {
  _id?: string;      // DODATO: Ovo je rešilo grešku "Property _id does not exist"
  product: string | OrderProduct; 
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  shippingInfo: ShippingInfo;
  orderItems: OrderItem[];
  totalPrice: number;
  user?: string | { _id: string; name: string };
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}