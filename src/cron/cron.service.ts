import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';

@Injectable()
export class CronService {

    @Cron('1/15 * * * 1-5')
    showSomeInfo() {
        console.log('Some info...', new Date());
    }

}
