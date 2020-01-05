import { EntityMetadata, QueryRunner, MongoDriver, RepositoryFactory } from '@nger/typeorm-native'
import { NgerEntityManager } from './EntityManager';
import { NgerRepository } from './Repository';
import { NgerTreeRepository } from './TreeRepository';
import { NgerMongoRepository } from './MongoRepository';
export class NgerRepositoryFactory extends RepositoryFactory {
    create(manager: NgerEntityManager, metadata: EntityMetadata, queryRunner?: QueryRunner): NgerRepository<any> {
        if (metadata.treeType) {
            // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
            // however we need these properties for internal work of the class
            const repository = new NgerTreeRepository<any>();
            Object.assign(repository, {
                manager: manager,
                metadata: metadata,
                queryRunner: queryRunner,
                injector: manager.injector
            });
            return repository;

        } else {
            // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
            // however we need these properties for internal work of the class
            let repository: NgerRepository<any>;
            if (manager.connection.driver instanceof MongoDriver) {
                repository = new NgerMongoRepository();
            } else {
                repository = new NgerRepository<any>();
            }
            Object.assign(repository, {
                manager: manager,
                metadata: metadata,
                queryRunner: queryRunner,
                injector: manager.injector
            });
            return repository;
        }
    }
}