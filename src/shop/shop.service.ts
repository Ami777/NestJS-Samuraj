import { Injectable } from '@nestjs/common';
import { ShopItemInterface } from '../interfaces/shop';
import {ShopItem} from "./shop-item.entity";
import {AddProductDto} from "./dto/add-product.dto";
import {MulterDiskUploadedFiles} from "../interfaces/files";
import * as fs from 'fs';
import * as path from 'path';
import {storageDir} from "../utils/storage";

@Injectable()
export class ShopService {
  filter(shopItem: ShopItem): ShopItemInterface {
    const {id, price, description, name} = shopItem;
    return {id, price, description, name};
  }

  async getItems(): Promise<ShopItemInterface[]> {
    return (await ShopItem.find()).map(this.filter);
  }

  async hasItem(name: string): Promise<boolean> {
    return (await this.getItems()).some(item => item.name === name);
  }

  async getPrice(name: string): Promise<number> {
    return (await this.getItems()).find(item => item.name === name).price;
  }

  async getOneItem(id: string): Promise<ShopItem> {
    return await ShopItem.findOne(id);
  }

  async addProduct(req: AddProductDto, files: MulterDiskUploadedFiles): Promise<ShopItemInterface> {
    const photo = files?.photo?.[0] ?? null;

    try {

      const shopItem = new ShopItem();
      shopItem.name = req.name;
      shopItem.description = req.description;
      shopItem.price = req.price;

      if (photo) {
        shopItem.photoFn = photo.filename;
      }

      await shopItem.save();

      return this.filter(shopItem);

    } catch(e) {
      try {
        if (photo) {
          fs.unlinkSync(
              path.join(storageDir(), 'product-photos', photo.filename)
          );
        }
      }catch(e2) {}

      throw e;
    }
  }

  async getPhoto(id: string, res: any) {
    try {
      const one = await ShopItem.findOne(id);

      if (!one) {
        throw new Error('No object found!');
      }

      if (!one.photoFn) {
        throw new Error('No photo in this entity!');
      }

      res.sendFile(
          one.photoFn,
          {
            root: path.join(storageDir(), 'product-photos'),
          },
      );

    } catch(e) {
      res.json({
        error: e.message,
      });
    }
  }

}
