import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

import { Post } from "../../lib/types";

function Pin({ item }: { item: Post }) {
  return (
    <Marker position={[item.latitude as any, item.longitude as any]}>
      <Popup>
        <div className="flex gap-5">
          <img src={item.img} alt="" className="w-16 h-12 object-cover rounded-md" />
          <div className="flex flex-col justify-between">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
