import { InjectionToken, Injector, Type, APP_INITIALIZER, Provider } from '@nger/core'
import {
    ConnectionManager,
    ConnectionOptions,
    useContainer
} from './typeorm-native';
import { TYPEORM_OPTIONS, TYPEORM_NAME, TYPEORM_ENTITIES, TypeormHook, TYPEORM_HOOK } from './token';

export function createRootProviders(options: ConnectionOptions | InjectionToken<ConnectionOptions>, hook?: Type<TypeormHook<any>>): (Provider | Provider[])[] {
    return [
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
                    const connection = manager.create({ ...options, entities: all } as any)
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