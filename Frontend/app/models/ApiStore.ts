import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";
import axios from "axios";

/**
 * Model description here for TypeScript hints.
 */

export const ApiStoreModel = types
  .model("ApiStore")
  .props({
    user: types.optional(
      types.model({
        id: types.maybeNull(types.number),
        username: types.maybeNull(types.string),
        email: types.maybeNull(types.string),
        role: types.optional(types.array(types.string), []),
      }),
      {}
    ),
    messages: types.optional(types.array(
      types.model({
        id: types.number,
        content: types.string,
        Horodatage: types.string,
        user: types.model({
          id: types.maybeNull(types.number),
          pseudo: types.string,
        }),
      })
    ), []),
    
    comments: types.optional(types.array(
      types.model({
        id: types.number,
        comment: types.string,
        date: types.string,
        user: types.model({
          id: types.maybeNull(types.number),
          type: types.maybeNull(types.string),
          pseudo: types.string,
        }),
        plant: types.model({
          id: types.maybeNull(types.number),
          type: types.maybeNull(types.string),
          name: types.string,
          photo: types.maybeNull(types.string),
        }),
      })
    ), []),
    conversations: types.optional(types.array(
      types.model({
        id: types.number,
        title: types.string,
        horodatage: types.string,
        user: types.array(
          types.model({
            id: types.maybeNull(types.number),
            pseudo: types.string,
          })
        ),
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
    isAuthentified: types.optional(types.boolean, false),
    isUser: types.optional(types.boolean, false),
    isBotaniste: types.optional(types.boolean, false),
    conversationId: types.maybeNull(types.number),
  })
  .volatile(() => ({
    loading: false,
  }))
  .actions(withSetPropAction)
  .views((self) => ({}))
  .actions((self) => ({
    setisUser(isUser: boolean) {
      self.isUser = isUser;
    },
  }))
  .actions((self) => ({
    setconversationId(conversationId: number) {
      self.conversationId = conversationId;
    },
  }))
  .actions((self) => ({
    setisBotaniste(isBotaniste: boolean) {
      self.isBotaniste = isBotaniste;
    },
  }))
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
      self.setLoading(false);
      try {
        const response = yield axios.post(
          "http://172.20.10.2:8000/api/login_check",
          { username, password }
        );
        const { token, user } = response.data.token;
        self.token = token;
        self.user = user;
        self.isUser = user.role.includes('ROLE_USER');
        self.isBotaniste = user.role.includes('ROLE_BOTANISTE');
        self.setisAuthentified(true);    
      } catch (error) {
        console.error(error);
      }
      self.setLoading(false);
    }),
    
  }))

  .actions((self) => ({
    fetchConseils: flow(function* () {
      self.setLoading(false);
      try {
        const response = yield axios.get("http://172.20.10.2:8000/api/comments", {
          headers: {
            Authorization: `Bearer ${self.token}`
          }
        });
        self.comments = response.data["hydra:member"];
      } catch (error) {
        console.error(error);
        self.setLoading(false);
      }
      self.setLoading(false);
    }),  
  }))

  .actions((self) => ({
    fetchMessages: flow(function* (conversationId: number) {
      self.setLoading(true);
      try {
        const response = yield axios.get(`http://172.20.10.2:8000/api/conversations/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${self.token}`
          }
        });
        self.messages = response.data.messages;
      } catch (error) {
        console.error(error);
        self.setLoading(false);
      }
      self.setLoading(false);
    }),
  }))
  
  .actions((self) => ({
    fetchConversations: flow(function* () {
      self.setLoading(true);
      try {
        const response = yield axios.get("http://172.20.10.2:8000/api/conversations", {
          headers: {
            Authorization: `Bearer ${self.token}`
          }
        });
        // Extract the member data from the response
        self.conversations = response.data["hydra:member"];
      } catch (error) {
        console.error(error);
        self.setLoading(false);
      }
      self.setLoading(false);
    }),       
  }))

  .actions((self) => ({
    deleteComment: flow(function* (commentId: number) {
      self.setLoading(true);
      try {
        const response = yield axios.delete(`http://172.20.10.2:8000/api/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${self.token}`
          }
        });
        self.fetchConseils();
      } catch (error) {
        console.error(error);
        // Gérer l'erreur de suppression
      }
      self.setLoading(false);
    }),  
  }))


  
  .actions((self) => ({
    addPlant: flow(function* (name: string, description: string, photo: string, user: string, latitude: number, longitude: number) {
      try {
        const response = yield axios.post(
          "http://172.20.10.2:8000/api/plants",
          { 
            name, 
            description, 
            photo, 
            user, 
            longitude,
            latitude, 
          },
          {
            headers: {
              Authorization: `Bearer ${self.token}`
            }
          }
        );
      } catch (error) {
        console.error(error);
        // Gérer l'erreur d'ajout de plante
      }
      self.setLoading(false);
    }),  
  }))

  .actions((self) => ({
    fetchPlants: flow(function* () {
      self.setLoading(true);
      try {
        const response = yield axios.get("http://172.20.10.2:8000/api/plants", {
          headers: {
            Authorization: `Bearer ${self.token}`
          }
        });
        self.plants = response.data["hydra:member"];
      } catch (error) {
        //console.error(error);
        // Handle error
      }
      self.setLoading(false);
    }),  
  }))

  .actions((self) => ({
    addComment: flow(function* (comment: string, date: string, user: string, plant: string) {
      self.setLoading(true);
      try {
        const response = yield axios.post(
          "http://172.20.10.2:8000/api/comments",
          { 
            comment, 
            date, 
            user, 
            plant
          },
          {
            headers: {
              Authorization: `Bearer ${self.token}`
            }
          }
        );
        self.fetchConseils();
      } catch (error) {
        console.error(error);
        // Handle add comment error
      }
      self.setLoading(false);
    }),  
  }))

  .actions((self) => ({
    resetStore: () => {
      self.comments.clear();
      self.plants.clear();
      self.token = null;
      self.user.id = null;
      self.user.username = null;
      self.user.email = null;
      self.user.role.clear();
      self.isAuthentified = false;
      self.isUser = false;
      self.isBotaniste = false;
      self.loading = false;
    },
  }))


  

export interface ApiStore extends Instance<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotOut extends SnapshotOut<typeof ApiStoreModel> {}
export interface ApiStoreSnapshotIn extends SnapshotIn<typeof ApiStoreModel> {}
export const createApiStoreDefaultModel = () =>
  types.optional(ApiStoreModel, {});
