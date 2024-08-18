import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

    async get(key: string) {
        console.log('GET ${key} from REDIS');
        return await this.cache.get(key);
    }

    async set(key: string, value: any) {
        console.log('SET ${key} from REDIS');
        await this.cache.set(key, value);
    }

    async del(key: string) {
        await this.cache.del(key);
    }
}
