import { getMetadataArgsStorage } from "../../";
import { EventListenerTypes } from "../../metadata/metadata-types/EventListenerTypes";
import { EntityListenerMetadataArgs } from "../../metadata-args/EntityListenerMetadataArgs";
import { createMethodDecorator } from '@nger/decorator'
export const BeforeInsert = createMethodDecorator(`BeforeInsert`, it => {
    getMetadataArgsStorage().entityListeners.push({
        target: it.type,
        propertyName: it.property,
        type: EventListenerTypes.BEFORE_INSERT
    } as EntityListenerMetadataArgs);
})
