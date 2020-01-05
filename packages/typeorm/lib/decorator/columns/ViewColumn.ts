import { getMetadataArgsStorage } from "../../";
import { ColumnMetadataArgs } from "../../metadata-args/ColumnMetadataArgs";
import { createPropertyDecorator } from '@nger/decorator'
export const ViewColumn = createPropertyDecorator(`ViewColumn`, it => {
    getMetadataArgsStorage().columns.push({
        target: it.type,
        propertyName: it.property,
        mode: "regular",
        options: {}
    } as ColumnMetadataArgs);
})
