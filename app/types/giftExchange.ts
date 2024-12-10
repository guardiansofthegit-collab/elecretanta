export interface GiftExchange {
  id: string;
  name: string;
  description?: string;
  group_image: string;
  budget: number;
  drawing_date: Date;
  exchange_date: Date;
  owner_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateGiftExchangeRequest {
  name: string;
  description?: string;
  group_image: string;
  budget: number;
  drawing_date: string;
  exchange_date: string;
}

export interface UpdateGiftExchangeRequest {
  name?: string;
  description?: string;
  group_image?: string;
  budget?: number;
  drawing_date?: string;
  exchange_date?: string;
}
