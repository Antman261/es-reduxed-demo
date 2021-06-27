import {createPostresEventStoreProvider} from "es-reduxed/lib/postgres/index.js";
import {initialiseEventSourcingSystem} from "es-reduxed";
import {poolConfig} from "../db/connection.js";
import {PollEvents} from "./reducer.js";
import {store as reduxStore} from "./store.js";

export const esInit = (async () => {

    const provider = createPostresEventStoreProvider<PollEvents>({
        eventSchema: 'polls_domain',
        poolConfig,
    });

    return await initialiseEventSourcingSystem<ReturnType<(typeof reduxStore.getState)>, PollEvents>({
        reduxStore,
        eventStoreProvider: provider,
    });
})();