import { Module, ModuleWithProviders, InjectionToken, Injector, Type, StaticProvider } from '@nger/core'
import {
    getConnection, Connection,
    ConnectionManager,
    ConnectionOptions, EntityManager, getMetadataArgsStorage,
    getManager, MetadataArgsStorage
} from './typeorm-native';
import { TYPEORM_NAME, TYPEORM_ENTITIES, TypeormHook, TYPEORM_HOOK } from './token';
import { NgerConnectionManager } from './ConnectionManager';
import { createRootProviders } from './util';
export * from './typeorm-native';
@Module({
    providers: [{
        provide: MetadataArgsStorage,
        useFactory: () => getMetadataArgsStorage()
    }, {
        provide: EntityManager,
        useFactory: (injector: Injector) => {
            const name = injector.get(TYPEORM_NAME)
            return getManager(name);
        },
        deps: [Injector]
    }, {
        provide: Connection,
        useFactory: (injector: Injector) => {
            const name = injector.get(TYPEORM_NAME)
            return getConnection(name)
        },
        deps: [Injector]
    }, {
        provide: ConnectionManager,
        useFactory: (injector: Injector) => {
            return new NgerConnectionManager(injector)
        },
        deps: [Injector]
    }]
})
export class TypeormModule {
    static forRoot(options: ConnectionOptions | InjectionToken<ConnectionOptions>, hook?: Type<TypeormHook<any>>): ModuleWithProviders {
        return {
            ngModule: TypeormModule,
            providers: createRootProviders(options, hook)
        }
    }
    static forFeature(entities: Type<any>[], hook?: Type<TypeormHook<any>>): ModuleWithProviders {
        return {
            ngModule: TypeormModule,
            providers: [
                hook ? {
                    provide: TYPEORM_HOOK,
                    useClass: hook,
                    multi: true
                } : [],
                {
                    provide: TYPEORM_ENTITIES,
                    useValue: entities,
                    multi: true
                },
                ...entities.map(it => {
                    return {
                        provide: it,
                        useFactory: (connection: Connection, store: MetadataArgsStorage) => {
                            const table = store.tables.find(table => table.target === it);
                            if (table) {
                                return connection.getRepository(it)
                            } else {
                                return connection.getTreeRepository(it)
                            }
                        },
                        deps: [Connection, MetadataArgsStorage]
                    } as StaticProvider;
                })
            ]
        }
    }
}

export * from './token';
export * from './SelectQueryBuilder'
export * from './typeorm-postgres-env.module'