import { ColumnOptions, getMetadataArgsStorage } from "../../";
import { ColumnMetadataArgs } from "../../metadata-args/ColumnMetadataArgs";
import { createPropertyDecorator } from '@nger/decorator'
/**
 * This column will store an update date of the updated object.
 * This date is being updated each time you persist the object.
 */
export const UpdateDateColumn = createPropertyDecorator<ColumnOptions>(`UpdateDateColumn`, it => {
    getMetadataArgsStorage().columns.push({
        target: it.type,
        propertyName: it.property,
        mode: "updateDate",
        options: it.options ? it.options : {}
    } as ColumnMetadataArgs);
})
