import { ApiStoreModel } from "./ApiStore"

test("can be created", () => {
  const instance = ApiStoreModel.create({})

  expect(instance).toBeTruthy()
})
