import { AddItemDto } from '../basket/dto/add-item.dto';

export type AddToBasketResponse = {
  isSuccess: true;
  id: string;
} | {
  isSuccess: false;
}

export interface RemoveFromBasketResponse {
  isSuccess: boolean;
}

interface OneItemInBasket {
  id: string;
  count: number;
}

export type GetBasketResponse = OneItemInBasket[];

export type GetTotalBasketPriceResponse = number;

export interface GetBasketStatsResponse {
  itemInBasketAvgPrice: number;
  basketAvgTotalPrice: number;
}