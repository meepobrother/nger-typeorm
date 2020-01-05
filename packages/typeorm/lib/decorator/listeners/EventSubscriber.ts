import { getMetadataArgsStorage } from "../../";
import { EntitySubscriberMetadataArgs } from "../../metadata-args/EntitySubscriberMetadataArgs";
import { createClassDecorator } from '@nger/decorator';
export const EventSubscriber = createClassDecorator(`EventSubscriber`, it => {
    getMetadataArgsStorage().entitySubscribers.push({
        target: it.type
    } as EntitySubscriberMetadataArgs);
});
