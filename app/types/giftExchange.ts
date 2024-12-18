export interface GiftExchange {
  id: string;
  name: string;
  description?: string;
  group_image: string;
  budget: number;
  drawing_date: string;
  exchange_date: string;
  owner_id: string;
  created_at?: Date;
  updated_at?: Date;
  status: string;
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
  status?: string;
}
