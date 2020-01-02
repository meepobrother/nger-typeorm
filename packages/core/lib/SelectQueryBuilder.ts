import { SelectQueryBuilder, QueryBuilder } from "typeorm";
import { getCurrentInjector } from "@nger/core";
import { TYPEORM_HOOK } from "./token";
import { NgerConnection } from './Connection'
import { ReadStream } from "typeorm/platform/PlatformTools";
export class NgerSelectQueryBuilder<T> extends SelectQueryBuilder<T> {
    async getRawMany(): Promise<any[]> {
        __beforeQuery(this)
        return super.getRawMany()
    }
    async getRawAndEntities(): Promise<{ entities: T[], raw: any[] }> {
        __beforeQuery(this)
        return super.getRawAndEntities()
    }
    async getCount(): Promise<number> {
        __beforeQuery(this)
        return super.getCount()
    }
    async getManyAndCount(): Promise<[T[], number]> {
        __beforeQuery(this)
        return super.getManyAndCount()
    }
    async stream(): Promise<ReadStream> {
        __beforeQuery(this)
        return super.stream()
    }
}

function __beforeQuery(qb: QueryBuilder<any>) {
    const injector = getCurrentInjector() || (qb.connection as NgerConnection).injector;
    if (injector) {
        const hooks = injector.get(TYPEORM_HOOK, []);
        hooks.map(hook => hook.before(qb))
    }
}