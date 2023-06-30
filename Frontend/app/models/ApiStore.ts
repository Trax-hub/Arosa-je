import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";
import axios from "axios";

/**
 * Model description here for TypeScript hints.
 */
export const ApiStoreModel = types
  .model("ApiStore")
  .props({
    comments: types.optional(types.array(
      types.model({
        id: types.number,
        comment: types.string,
        date: types.string,
        user: types.string,
        plant: types.string,
      })
    ), []),
    plants: types.optional(types.array(
      types.model({
        id: types.number,
        name: types.string,
        description: types.string,
        photo: types.string,
        user: types.string,
        latitude: types.number,
        longitude: types.number,
      })
    ), []),
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
    isAuthentified: types.optional(types.boolean, false), 
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
    setConseils(comments: any) {
      self.comments = comments;
    },
  }))
  .actions((self) => ({
    login: flow(function* (username: string, password: string) {
      self.setLoading(true);
      try {
        const response = yield axios.post(
          "http://10.60.104.56:8000/api/login_check",
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
  }))

  .actions((self) => ({
    fetchConseils: flow(function* () {
      self.setLoading(true);
      try {
        const response = yield axios.get("http://10.60.104.56:8000/api/comments", {
          headers: {
            Authorization: `Bearer ${self.token}`
          }
        });
        self.comments = response.data["hydra:member"];
      } catch (error) {
        console.error(error);
        // Handle error
      }
      self.setLoading(false);
    }),  
  }))

  .actions((self) => ({
    fetchPlants: flow(function* () {
      self.setLoading(true);
      try {
        const response = yield axios.get("http://10.60.104.56:8000/api/plants", {
          headers: {
            Authorization: `Bearer ${self.token}`
          }
        });
        self.plants = response.data["hydra:member"];
      } catch (error) {
        console.error(error);
        // Handle error
      }
      self.setLoading(false);
    }),  
  }))

export interface ApiStore extends Instance<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotOut extends SnapshotOut<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotIn extends SnapshotIn<typeof ApiStoreModel> {}
export const createApiStoreDefaultModel = () =>
  types.optional(ApiStoreModel, {});