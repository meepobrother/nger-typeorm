import { InjectionToken, Type } from "@nger/core";
import { ConnectionOptions } from 'typeorm'
export const TYPEORM_OPTIONS = new InjectionToken<ConnectionOptions>(`TYPEORM_OPTIONS`)
export const TYPEORM_NAME = new InjectionToken<string>(`TYPEORM_NAME`)
export const TYPEORM_ENTITIES = new InjectionToken<Type<any>[][]>(`TYPEORM_ENTITIES`)