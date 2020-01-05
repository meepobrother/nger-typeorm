import { ColumnOptions, getMetadataArgsStorage } from "../../";
import { ColumnMetadataArgs } from "../../metadata-args/ColumnMetadataArgs";
import { createPropertyDecorator} from '@nger/decorator'
export const CreateDateColumn = createPropertyDecorator<ColumnOptions>(`CreateDateColumn`,it=>{
    getMetadataArgsStorage().columns.push({
        target: it.type,
        propertyName: it.propertyType,
        mode: "createDate",
        options: it.options || {}
    } as ColumnMetadataArgs);
})
