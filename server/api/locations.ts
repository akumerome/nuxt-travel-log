import { Location } from "../models/Location";

export default defineEventHandler(async (event) => {
  // Make sure the user is logged in
  // This will throw a 401 error if the request doesn't come from a valid user session
  const { user } = await requireUserSession(event);

  const locations = await Location.find();
  return locations;
});
