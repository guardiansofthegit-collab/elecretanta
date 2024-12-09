export interface GiftExchangeMember {
  id: string;
  gift_exchange_id: string;
  user_id: string;
  recipient_id: string | null;
  has_drawn: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateGiftExchangeMemberRequest {
  user_id: string;
  recipient_id?: string;
}

export interface UpdateGiftExchangeMemberRequest {
  recipient_id?: string;
  has_drawn?: boolean;
}
