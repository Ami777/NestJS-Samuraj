import {forwardRef, Module} from '@nestjs/common';
import {ShopController} from "./shop.controller";
import {ShopService} from "./shop.service";
import {BasketModule} from "../basket/basket.module";

@Module({
    imports: [
        forwardRef(() => BasketModule),
    ],
    controllers: [ShopController],
    providers: [ShopService],
    exports: [ShopService],
})
export class ShopModule {
}
