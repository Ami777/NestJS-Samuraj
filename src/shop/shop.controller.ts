import {Body, Controller, Get, Inject, Param, Post, Res, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {ShopItemInterface} from "../interfaces/shop";
import {ShopService} from './shop.service';
import {AddProductDto} from "./dto/add-product.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import * as path from 'path';
import {multerStorage, storageDir} from "../utils/storage";
import {MulterDiskUploadedFiles} from "../interfaces/files";

@Controller('shop')
export class ShopController {

    constructor(
        @Inject(ShopService) private shopService: ShopService,
    ) {
    }

    @Get('/')
    getShopList(): Promise<ShopItemInterface[]> {
        return this.shopService.getItems();
    }

    @Post('/')
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo', maxCount: 10,
            },
            ], {storage: multerStorage(path.join(storageDir(), 'product-photos'))},
        ),
    )
    addProduct(
        @Body() req: AddProductDto,
        @UploadedFiles() files: MulterDiskUploadedFiles,
    ): Promise<ShopItemInterface> {
        return this.shopService.addProduct(req, files);
    }

    @Get('/photo/:id')
    async getPhoto(
        @Param('id') id: string,
        @Res() res: any,
    ): Promise<any> {
        return this.shopService.getPhoto(id, res);
    }

}
