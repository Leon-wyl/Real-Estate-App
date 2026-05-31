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
    <div className="flex h-full">
      <div className="flex-[3] h-full">
        <div className="h-full pr-[50px] flex flex-col gap-[50px] overflow-y-scroll pb-[50px]">
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
      <div className="flex-[2] h-full bg-[#fcf5f3] max-[1024px]:hidden">
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
