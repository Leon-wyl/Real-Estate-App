import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { Post } from "../../lib/types";

interface ListPageLoaderData {
  postResponse: Promise<{ data: Post[] }>;
}

function ListPage() {
  const data = useLoaderData() as ListPageLoaderData;

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<div>Loading...</div>}>
            <Await
              resolve={data.postResponse}
              errorElement={<div>Error loading posts!</div>}
            >
              {(postResponse: { data: Post[] }) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<div>Loading...</div>}>
          <Await
            resolve={data.postResponse}
            errorElement={<div>Error loading Map!</div>}
          >
            {(postResponse: { data: Post[] }) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
