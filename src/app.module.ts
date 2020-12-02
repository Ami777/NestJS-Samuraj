import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from './user/user.module';
import {ShopModule} from "./shop/shop.module";
import {BasketModule} from "./basket/basket.module";
import {CronModule} from './cron/cron.module';
import {CacheModule} from './cache/cache.module';
import {MailModule} from './mail/mail.module';
import {AuthModule} from './auth/auth.module';
import {ConsoleModule} from "nestjs-console";

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        ShopModule,
        BasketModule,
        UserModule,
        CronModule,
        CacheModule,
        MailModule,
        AuthModule,
        ConsoleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
