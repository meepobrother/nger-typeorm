import { EntityManager } from 'typeorm/entity-manager/EntityManager'
import {
    QueryRunner, ObjectType, EntitySchema, ObjectID,
    FindOneOptions, ObjectLiteral, FindOptionsUtils,
    FindManyOptions, QueryBuilder
} from 'typeorm'
import { NgerConnection } from './Connection';
import { Injector, getCurrentInjector } from '@nger/core';
import { NgerRepository } from './Repository';
import { RepositoryNotFoundError } from 'typeorm/error/RepositoryNotFoundError'
import { TreeRepositoryNotSupportedError } from 'typeorm/error/TreeRepositoryNotSupportedError'
import { RepositoryNotTreeError } from 'typeorm/error/RepositoryNotTreeError'
import { NgerRepositoryFactory } from './RepositoryFactory';
import { NgerTreeRepository } from './TreeRepository';
import { NgerMongoRepository } from './MongoRepository';
import { TYPEORM_HOOK } from './token';
export class NgerEntityManager extends EntityManager {
    injector: Injector;
    readonly connection: NgerConnection;
    protected repositories: NgerRepository<any>[];
    constructor(connection: NgerConnection, queryRunner?: QueryRunner) {
        super(connection, queryRunner);
        const current = getCurrentInjector();
        if (current) this.injector = current
    }
    async count<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<number> {
        const metadata = this.connection.getMetadata(entityClass);
        const qb = this.createQueryBuilder(entityClass as any, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
        this.beforeQuery(qb);
        return qb.getCount();
    }
    async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<Entity[]> {
        const metadata = this.connection.getMetadata(entityClass);
        const qb = this.createQueryBuilder<Entity>(entityClass as any, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        if (!FindOptionsUtils.isFindManyOptions(optionsOrConditions) || optionsOrConditions.loadEagerRelations !== false)
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
        this.beforeQuery(qb);
        return qb.getMany();
    }
    async findAndCount<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<[Entity[], number]> {
        const metadata = this.connection.getMetadata(entityClass);
        const qb = this.createQueryBuilder<Entity>(entityClass as any, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        if (!FindOptionsUtils.isFindManyOptions(optionsOrConditions) || optionsOrConditions.loadEagerRelations !== false)
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions)
        this.beforeQuery(qb);
        return qb.getManyAndCount();
    }
    async findByIds<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, ids: any[], optionsOrConditions?: FindManyOptions<Entity> | any): Promise<Entity[]> {
        if (!ids.length)
            return Promise.resolve([]);
        const metadata = this.connection.getMetadata(entityClass);
        const qb = this.createQueryBuilder<Entity>(entityClass as any, FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
        if (!FindOptionsUtils.isFindManyOptions(optionsOrConditions) || optionsOrConditions.loadEagerRelations !== false)
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);
        qb.andWhereInIds(ids)
        this.beforeQuery(qb)
        return qb.getMany();
    }
    async findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        let findOptions: FindManyOptions<any> | FindOneOptions<any> | undefined = undefined;
        if (FindOptionsUtils.isFindOneOptions(idOrOptionsOrConditions)) {
            findOptions = idOrOptionsOrConditions;
        } else if (maybeOptions && FindOptionsUtils.isFindOneOptions(maybeOptions)) {
            findOptions = maybeOptions;
        }
        let options: ObjectLiteral | undefined = undefined;
        if (idOrOptionsOrConditions instanceof Object && !FindOptionsUtils.isFindOneOptions(idOrOptionsOrConditions))
            options = idOrOptionsOrConditions as ObjectLiteral;
        const metadata = this.connection.getMetadata(entityClass);
        let alias: string = metadata.name;
        if (findOptions && findOptions.join) {
            alias = findOptions.join.alias;

        } else if (maybeOptions && FindOptionsUtils.isFindOneOptions(maybeOptions) && maybeOptions.join) {
            alias = maybeOptions.join.alias;
        }
        const qb = this.createQueryBuilder<Entity>(entityClass as any, alias);
        if (!findOptions || findOptions.loadEagerRelations !== false)
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        findOptions = {
            ...(findOptions || {}),
            take: 1,
        };
        FindOptionsUtils.applyOptionsToQueryBuilder(qb, findOptions);
        if (options) {
            qb.where(options);
        } else if (typeof idOrOptionsOrConditions === "string" || typeof idOrOptionsOrConditions === "number" || (idOrOptionsOrConditions as any) instanceof Date) {
            qb.andWhereInIds(metadata.ensureEntityIdMap(idOrOptionsOrConditions));
        }
        this.beforeQuery(qb);
        return qb.getOne();
    }

    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): NgerRepository<Entity> {
        // throw exception if there is no repository with this target registered
        if (!this.connection.hasMetadata(target))
            throw new RepositoryNotFoundError(this.connection.name, target);
        // find already created repository instance and return it if found
        const metadata = this.connection.getMetadata(target);
        const repository = this.repositories.find(repository => repository.metadata === metadata);
        if (repository)
            return repository;
        // if repository was not found then create it, store its instance and return it
        const newRepository = new NgerRepositoryFactory().create(this, metadata, this.queryRunner);
        this.repositories.push(newRepository);
        return newRepository;
    }
    getTreeRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): NgerTreeRepository<Entity> {
        // tree tables aren't supported by some drivers (mongodb)
        if (this.connection.driver.treeSupport === false)
            throw new TreeRepositoryNotSupportedError(this.connection.driver);
        // check if repository is real tree repository
        const repository = this.getRepository(target);
        if (!(repository instanceof NgerTreeRepository))
            throw new RepositoryNotTreeError(target);
        return repository;
    }
    getMongoRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): NgerMongoRepository<Entity> {
        return this.connection.getMongoRepository<Entity>(target);
    }
    private beforeQuery(qb: QueryBuilder<any>) {
        const injector = getCurrentInjector() || this.injector || (qb.connection as NgerConnection).injector;
        if (injector) {
            const hooks = injector.get(TYPEORM_HOOK, []);
            hooks.map(hook => hook.before(qb))
        }
    }
}
