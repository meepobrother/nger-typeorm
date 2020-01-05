import { EntityOptions, getMetadataArgsStorage } from "../../";
import { TableMetadataArgs } from "../../metadata-args/TableMetadataArgs";
import { createClassDecorator } from '@nger/decorator'
export const Entity = createClassDecorator<EntityOptions>(`Entity`, it => {
    const options: EntityOptions = it.options || {};
    getMetadataArgsStorage().tables.push({
        target: it.type,
        name: options.name,
        type: "regular",
        orderBy: options.orderBy ? options.orderBy : undefined,
        engine: options.engine ? options.engine : undefined,
        database: options.database ? options.database : undefined,
        schema: options.schema ? options.schema : undefined,
        synchronize: options.synchronize,
        withoutRowid: options.withoutRowid
    } as TableMetadataArgs);
})
