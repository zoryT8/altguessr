import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";

interface MapCardProps {
  map: Record<string, any>;
  deleteMap: (id: number) => void;
}

function MapCard({ map, deleteMap }: MapCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        {/* PRODUCT INFO */}
        <h2 className="card-title text-lg font-semibold">{map.map_name}</h2>
        <p className="text-2xl font-bold text-primary">{map.description}</p>

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/maps/${map.id}`}
            className="btn btn-sm btn-info btn-outline"
          >
            <EditIcon className="size-4" />
          </Link>

          <button
            className="btn btn-sm btn-error  btn-outline"
            onClick={() => deleteMap(map.id)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default MapCard;
