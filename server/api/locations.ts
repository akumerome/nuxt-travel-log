import { Location } from "../models/Location";

export default defineEventHandler(async () => {
  const locations = await Location.find();
  return locations;
});
