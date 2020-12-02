import {Inject, Injectable} from '@nestjs/common';
import {
    AddToBasketResponse,
    GetBasketResponse, GetBasketStatsResponse,
    GetTotalBasketPriceResponse,
    RemoveFromBasketResponse,
} from '../interfaces/basket';
import {ShopService} from '../shop/shop.service';
import {AddItemDto} from './dto/add-item.dto';
import {ItemInBasket} from "./item-in-basket.entity";
import {ShopItem} from "../shop/shop-item.entity";
import {UserService} from "../user/user.service";
import {getConnection} from "typeorm";
import {MailService} from "../mail/mail.service";
import {addedToBasketInfoEmailTemplate} from "../templates/email/added-to-basket-info";
import {User} from "../user/user.entity";

@Injectable()
export class BasketService {
    constructor(
        @Inject(ShopService) private shopService: ShopService,
        @Inject(UserService) private userService: UserService,
        @Inject(MailService) private mailService: MailService,
    ) {
    }


    async add(product: AddItemDto, user: User): Promise<AddToBasketResponse> {
        const {count, productId} = product;

        const shopItem = await this.shopService.getOneItem(productId);

        if (
            typeof productId !== 'string'
            ||
            typeof count !== 'number'
            ||
            productId === ''
            ||
            count < 1
            ||
            !shopItem
        ) {
            return {
                isSuccess: false,
            };
        }

        const item = new ItemInBasket();
        item.count = count;

        await item.save();

        item.shopItem = shopItem;
        item.user = user;

        await item.save();

        await this.mailService.sendMail(user.email, 'Dziękujemy za dodanie do koszyka!', addedToBasketInfoEmailTemplate());

        return {
            isSuccess: true,
            id: item.id,
        };
    }

    async remove(itemInBasketId: string, userId: string): Promise<RemoveFromBasketResponse> {
        const user = await this.userService.getOneUser(userId);

        if (!user) {
            throw new Error('User not found!');
        }

        const item = await ItemInBasket.findOne({
            where: {
                id: itemInBasketId,
                user,
            },
        });

        if (item) {
            await item.remove();

            return {
                isSuccess: true,
            };
        }

        return {
            isSuccess: false,
        };
    }

    async getAllForUser(userId: string): Promise<ItemInBasket[]> {
        const user = await this.userService.getOneUser(userId);

        if (!user) {
            throw new Error('User not found!');
        }

        return ItemInBasket.find({
            where: {
                user,
            },
            relations: ['shopItem'],
        });
    }

    async getAllForAdmin(): Promise<ItemInBasket[]> {
        return ItemInBasket.find({
            relations: ['shopItem', 'user'],
        });
    }

    async clearBasket(userId: string) {
        const user = await this.userService.getOneUser(userId);

        if (!user) {
            throw new Error('User not found!');
        }

        await ItemInBasket.delete({
            user,
        });
    }

    async getTotalPrice(userId: string): Promise<GetTotalBasketPriceResponse> {
        const items = await this.getAllForUser(userId);

        return (await Promise.all(items.map(async item => item.shopItem.price * item.count * 1.23)))
            .reduce((prev, curr) => prev + curr, 0);
    }

    async getStats(): Promise<GetBasketStatsResponse> {

        const {itemInBasketAvgPrice} = await getConnection()
            .createQueryBuilder()
            .select('AVG(shopItem.price)', 'itemInBasketAvgPrice')
            .from(ItemInBasket, 'itemInBasket')
            .leftJoinAndSelect('itemInBasket.shopItem', 'shopItem')
            .getRawOne();

        const allItemsInBasket = await this.getAllForAdmin();

        const baskets: {
            [userId: string]: number;
        } = {};

        for (const oneItemInBasket of allItemsInBasket) {
            baskets[oneItemInBasket.user.id] = baskets[oneItemInBasket.user.id] || 0;

            baskets[oneItemInBasket.user.id] += oneItemInBasket.shopItem.price * oneItemInBasket.count * 1.23;
        }

        const basketValues = Object.values(baskets);

        const basketAvgTotalPrice = basketValues.reduce((prev, curr) => prev + curr, 0) / basketValues.length;

        return {
            itemInBasketAvgPrice,
            basketAvgTotalPrice,
        };

    }
}
