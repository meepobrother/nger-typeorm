import { ColumnOptions, getMetadataArgsStorage } from "../../";
import { ColumnMetadataArgs } from "../../metadata-args/ColumnMetadataArgs";
import { createPropertyDecorator } from '@nger/decorator'
/**
 * This column will store a number - version of the entity.
 * Every time your entity will be persisted, this number will be increased by one -
 * so you can organize visioning and update strategies of your entity.
 */
export const VersionColumn = createPropertyDecorator<ColumnOptions>(`VersionColumn`, it => {
    getMetadataArgsStorage().columns.push({
        target: it.type,
        propertyName: it.property,
        mode: "version",
        options: it.options || {}
    } as ColumnMetadataArgs);
})

