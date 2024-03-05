import Jsona from "jsona";
import {TDeserializeOptions, TJsonApiBody} from "jsona/src/JsonaTypes";

const dataFormatter = new Jsona()

export const deserialize = (body: TJsonApiBody | string, options?: TDeserializeOptions) => {
  if (!body) return null
  return dataFormatter.deserialize(body, options)
}