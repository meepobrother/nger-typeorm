import { Module, Injector, InjectionToken, Config, isDevMode, ModuleWithProviders, Type } from "@nger/core";
import { ConnectionOptions } from './typeorm-native';
import { TypeormModule } from ".";
import { TypeormHook } from "./token";
import { createRootProviders } from "./util";
export const TYPEORM_CONFIG = new InjectionToken<ConnectionOptions>(`TYPEORM_CONFIG`)
/**
 * DB_POSTGRES_PORT=5433
 * DB_POSTGRES_DATABASE=default
 * DB_POSTGRES_USERNAME=default
 * DB_POSTGRES_PASSWORD=secret
 * DB_POSTGRES_HOST=postgres
 */
@Module()
export class TypeormPostgresEnvModule {
    static forRoot(hook?: Type<TypeormHook<any>>): ModuleWithProviders {
        return {
            ngModule: TypeormModule,
            providers: [
                {
                    provide: TYPEORM_CONFIG,
                    useFactory: (injector: Injector) => {
                        const config = injector.get(Config)
                        return {
                            type: 'postgres',
                            name: config.get('TYPEORM_NAME', 'root'),
                            username: config.get('DB_POSTGRES_USERNAME', 'magnus'),
                            password: config.get('DB_POSTGRES_PASSWORD', 'magnus'),
                            host: config.get('DB_POSTGRES_HOST', '193.112.55.191'),
                            port: config.get('DB_POSTGRES_PORT', 5432),
                            entities: [],
                            synchronize: isDevMode()
                        }
                    },
                    deps: [Injector]
                },
                ...createRootProviders(TYPEORM_CONFIG, hook)
            ]
        }
    }
}
