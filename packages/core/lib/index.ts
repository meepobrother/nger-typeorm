import { Module, ModuleWithProviders, InjectionToken, Injector, Type, APP_INITIALIZER, StaticProvider, getCurrentInjector } from '@nger/core'
import {
    getConnection, Connection,
    ConnectionManager, getConnectionManager,
    ConnectionOptions, EntityManager, getMetadataArgsStorage,
    getManager, useContainer
} from 'typeorm';
import { MetadataArgsStorage } from 'typeorm/metadata-args/MetadataArgsStorage'
import { TYPEORM_OPTIONS, TYPEORM_NAME, TYPEORM_ENTITIES, TypeormHook, TYPEORM_HOOK } from './token';
import { NgerConnectionManager } from './ConnectionManager';
export * from 'typeorm';
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
            providers: [
                hook ? {
                    provide: TYPEORM_HOOK,
                    useClass: hook,
                    multi: true
                } : [],
                {
                    provide: APP_INITIALIZER,
                    useFactory: (injector: Injector) => {
                        useContainer(injector)
                        return async () => {
                            const manager = injector.get(ConnectionManager)
                            const options = injector.get(TYPEORM_OPTIONS)
                            const entities = injector.get(TYPEORM_ENTITIES, [])
                            const all = [...new Set(entities.flat())];
                            const connection = manager.create({ ...options, entities: all })
                            return connection.connect();
                        }
                    },
                    deps: [Injector],
                    multi: true
                }, {
                    provide: TYPEORM_OPTIONS,
                    useFactory: (injector: Injector) => {
                        return options instanceof InjectionToken ? injector.get(options) : options;
                    },
                    deps: [Injector]
                }, {
                    provide: TYPEORM_NAME,
                    useFactory: (injector: Injector) => {
                        const options = injector.get(TYPEORM_OPTIONS)
                        return options.name || 'default'
                    },
                    deps: [Injector]
                }]
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