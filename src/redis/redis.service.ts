import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

    async get(key: string) {
        console.log(`GET ${key} from REDIS`);
        const data = await this.cache.get(key);
        if (typeof data === 'string' && data) {
            return JSON.parse(data);
        } 
        console.log("MISS2!")
        return null;
    }

    async set(key: string, value: any) {
        console.log(`SET ${key} from REDIS`);
        await this.cache.set(key, JSON.stringify(value), 10000);
    }

    async del(key: string) {
        await this.cache.del(key);
    }
}
