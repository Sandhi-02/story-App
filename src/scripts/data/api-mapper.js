import Map from "../utils/map.js";

export async function storyMapper(story) {
  return {
    ...story,
    location: {
      ...story.location,
      placeName: await Map.getPlaceNameByCoordinate(story.lat, story.lon),
    },
  };
}
