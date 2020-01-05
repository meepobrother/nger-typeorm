import { getMetadataArgsStorage } from "../../";
import { TableMetadataArgs } from "../../metadata-args/TableMetadataArgs";
import { ViewEntityOptions } from "../options/ViewEntityOptions";
import { createClassDecorator } from '@nger/decorator'
export const ViewEntity = createClassDecorator<ViewEntityOptions>(`ViewEntity`, it => {
    const options = it.options || {}
    getMetadataArgsStorage().tables.push({
        target: it.type,
        name: options.name,
        expression: options.expression,
        type: "view",
        database: options.database ? options.database : undefined,
        schema: options.schema ? options.schema : undefined,
        synchronize: options.synchronize === false ? false : true,
        materialized: !!options.materialized
    } as TableMetadataArgs);
})
