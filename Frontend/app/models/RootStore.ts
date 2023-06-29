import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ApiStoreModel } from "./ApiStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    apiStore: types.optional(ApiStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
