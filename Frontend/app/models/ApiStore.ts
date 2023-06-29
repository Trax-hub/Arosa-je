import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";
import axios from "axios";

/**
 * Model description here for TypeScript hints.
 */
export const ApiStoreModel = types
  .model("ApiStore")
  .props({
    posts: types.optional(types.array(types.frozen()), []),
    token: types.maybeNull(types.string),
    user: types.optional(
      types.model({
        id: types.maybeNull(types.number),
        username: types.maybeNull(types.string),
        email: types.maybeNull(types.string),
        role: types.optional(types.array(types.string), []),
      }),
      {}
    ),
    isAuthentified : types.optional(types.boolean, false)
  })
  .volatile(() => ({
    loading: false,
  }))
  .actions(withSetPropAction)
  .views((self) => ({}))
  .actions((self) => ({
    setisAuthentified(isAuthentified: boolean) {
      self.isAuthentified = isAuthentified;
    },
  }))
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
      self.setLoading(true);
      try {
        const response = yield axios.get("http://10.60.104.105:8000/api/posts");
        self.posts = response.data["hydra:member"];
      } catch (error) {
        console.error(error);
        self.setLoading(false);
      }
      self.setLoading(false);
    }),
  }))
  .actions((self) => ({
    login: flow(function* (username: string, password: string) {
      self.setLoading(true);
      try {
        const response = yield axios.post(
          "http://10.60.104.105:8000/api/login_check",
          { username, password }
        );
        const { token, user } = response.data;
        self.token = token.token;
        self.user = user;
        self.setisAuthentified(true)
      } catch (error) {
        console.error(error);
        // Handle login error
      }
      self.setLoading(false);
    }),
  }));

export interface ApiStore extends Instance<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotOut extends SnapshotOut<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotIn extends SnapshotIn<typeof ApiStoreModel> {}
export const createApiStoreDefaultModel = () =>
  types.optional(ApiStoreModel, {});
