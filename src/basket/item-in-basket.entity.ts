import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {AddItemDto} from "./dto/add-item.dto";
import {ShopItem} from "../shop/shop-item.entity";
import {User} from "../user/user.entity";

@Entity()
export class ItemInBasket extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    count: number;

    @ManyToOne(type => ShopItem, entity => entity.itemsInBasket)
    @JoinColumn()
    shopItem: ShopItem;

    @ManyToOne(type => User, entity => entity.itemsInBasket)
    @JoinColumn()
    user: User;
}