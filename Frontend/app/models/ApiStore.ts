import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import axios from "axios"

/**
 * Model description here for TypeScript hints.
 */
export const ApiStoreModel = types
  .model("ApiStore")
  .props({
    posts: types.optional(types.array(types.frozen()), [])
  })
  .volatile(() => ({
    loading: false,
  }))
  .actions(withSetPropAction)
  .views((self) => ({}))

  .actions((self) => ({
    setLoading(loading: boolean) {
      self.loading = loading;
    },
  }))

  .actions((self) => ({
    setConseils(posts: any) {
      self.posts = posts;
    },
  }))

  .actions((self) => ({
    fetchConseils: flow(function* () {
      self.setLoading(true)
      try {
        const response = yield axios.get("http://192.168.254.53:8000/api/posts");
        self.posts = response.data['hydra:member'];
      } catch (error) {
        console.error(error)
      }
      self.setLoading(false)
    }),
  }))

export interface ApiStore extends Instance<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotOut extends SnapshotOut<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotIn extends SnapshotIn<typeof ApiStoreModel> {}
export const createApiStoreDefaultModel = () => types.optional(ApiStoreModel, {})
