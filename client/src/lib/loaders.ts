import { defer, LoaderFunction } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader: LoaderFunction = async ({ params }) => {
  const res = await apiRequest.get("/posts/" + params.id);
  return res.data;
};

export const listPageLoader: LoaderFunction = async ({ request }) => {
  const query = request.url.split("?")[1];
  const resPromise = apiRequest.get("/posts?" + (query || ""));
  return defer({
    postResponse: resPromise,
  });
};
