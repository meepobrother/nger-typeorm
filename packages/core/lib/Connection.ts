import { Connection, MongoDriver, ConnectionOptions, QueryRunner, EntityManager, ObjectType, EntitySchema, MongoEntityManager } from '@nger/typeorm-native'
import { Injector, getCurrentInjector } from '@nger/core';
import { NgerEntityManagerFactory } from './EntityManagerFactory';
import { NgerMongoRepository } from './MongoRepository';
import { NgerEntityManager } from './EntityManager';
import { NgerSelectQueryBuilder } from './SelectQueryBuilder';
export class NgerConnection extends Connection {
    readonly manager: NgerEntityManager;
    public injector: Injector;
    constructor(options: ConnectionOptions, injector: Injector) {
        super(options)
        this.injector = injector || getCurrentInjector()
    }
    getMongoRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): NgerMongoRepository<Entity> {
        if (!(this.driver instanceof MongoDriver))
            throw new Error(`You can use getMongoRepository only for MongoDB connections.`);
        return this.manager.getRepository(target) as any;
    }
    createEntityManager(queryRunner?: QueryRunner): EntityManager {
        return new NgerEntityManagerFactory().create(this, queryRunner);
    }
    createQueryBuilder<Entity>(entityOrRunner?: ObjectType<Entity> | EntitySchema<Entity> | Function | string | QueryRunner, alias?: string, queryRunner?: QueryRunner): NgerSelectQueryBuilder<Entity> {
        if (this instanceof MongoEntityManager)
            throw new Error(`Query Builder is not supported by MongoDB.`);
        if (alias) {
            const metadata = this.getMetadata(entityOrRunner as Function | EntitySchema<Entity> | string);
            return new NgerSelectQueryBuilder(this, queryRunner)
                .select(alias)
                .from(metadata.target, alias) as any;
        } else {
            return new NgerSelectQueryBuilder(this, entityOrRunner as QueryRunner | undefined);
        }
    }
}