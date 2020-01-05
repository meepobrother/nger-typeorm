import { getMetadataArgsStorage } from "../../";
import { EventListenerTypes } from "../../metadata/types/EventListenerTypes";
import { EntityListenerMetadataArgs } from "../../metadata-args/EntityListenerMetadataArgs";
import { createMethodDecorator } from '@nger/decorator'
export const AfterInsert = createMethodDecorator(`AfterInsert`, it => {
    getMetadataArgsStorage().entityListeners.push({
        target: it.type,
        propertyName: it.property,
        type: EventListenerTypes.AFTER_INSERT
    } as EntityListenerMetadataArgs);
})
