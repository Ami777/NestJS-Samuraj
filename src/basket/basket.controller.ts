import {Body, Controller, Delete, Get, Inject, Param, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import {
    AddToBasketResponse,
    GetBasketResponse,
    GetBasketStatsResponse,
    GetTotalBasketPriceResponse,
    RemoveFromBasketResponse,
} from '../interfaces/basket';
import {BasketService} from './basket.service';
import {AddItemDto} from './dto/add-item.dto';
import {PasswordProtectGuard} from "../guards/password-protect.guard";
import {UsePassword} from "../decorators/use-password.decorator";
import {MyTimeoutInterceptor} from "../interceptors/my-timeout.interceptor";
import {MyCacheInterceptor} from "../interceptors/my-cache.interceptor";
import {UseCacheTime} from "../decorators/use-cache-time.decorator";
import {AuthGuard} from "@nestjs/passport";
import {UserObj} from "../decorators/user-obj.decorator";
import {User} from "../user/user.entity";

@Controller('basket')
export class BasketController {

    constructor(
        @Inject(BasketService) private basketService: BasketService,
    ) {
    }

    @Post('/')
    @UseGuards(AuthGuard('jwt'))
    addProductToBasket(
        @Body() product: AddItemDto,
        @UserObj() user: User,
    ): Promise<AddToBasketResponse> {
        return this.basketService.add(product, user);
    }

    @Delete('/all/:userId')
    clearBasket(
        @Param('userId') userId: string,
    ) {
        this.basketService.clearBasket(userId);
    }

    @Delete('/:itemInBasketId/:userId')
    removeProduct(
        @Param('itemInBasketId') itemInBasketId: string,
        @Param('userId') userId: string,
    ): Promise<RemoveFromBasketResponse> {
        return this.basketService.remove(itemInBasketId, userId);
    }

    @Get('/admin')
    @UseGuards(PasswordProtectGuard)
    @UsePassword('admin1')
    getBasketForAdmin(): Promise<GetBasketResponse> {
        return this.basketService.getAllForAdmin();
    }

    @Get('/stats')
    @UseGuards(PasswordProtectGuard)
    @UsePassword('passforstats')
    @UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
    @UseCacheTime(10)
    getStats(): Promise<GetBasketStatsResponse> {
        return this.basketService.getStats();
    }

    @Get('/:userId')
    getBasket(
        @Param('userId') userId: string,
    ): Promise<GetBasketResponse> {
        return this.basketService.getAllForUser(userId);
    }

    @Get('/total-price/:userId')
    getTotalBasketPrice(
        @Param('userId') userId: string,
    ): Promise<GetTotalBasketPriceResponse> {
        return this.basketService.getTotalPrice(userId);
    }

}
