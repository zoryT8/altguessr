import {
  EditIcon,
  Trash2Icon,
  Play,
  Eye,
  MousePointerClick,
  Gamepad2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelectedMapStore } from "../store/useSelectedMapStore";
import toast from "react-hot-toast";

interface MapCardProps {
  map: Record<string, any>;
  deleteMap: (id: number) => void;
}

function MapCard({ map, deleteMap }: MapCardProps) {
  const { setSelectedMap } = useSelectedMapStore();

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        {/* MAP INFO */}
        <div className="flex justify-between items-center">
          <h2 className="card-title text-2xl font-bold text-accent">
            {map.map_name}
          </h2>
          <div
            className="flex items-center tooltip tooltip-accent"
            data-tip="Total map plays"
          >
            <p className="text-lg font-semibold text-white">
              {map.total_plays}
            </p>
            <Gamepad2 className="size-5 ml-1.5 text-accent"></Gamepad2>
          </div>
        </div>
        <p className="text-lg font-semibold text-white">{map.description}</p>

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-4">
          <Link to={`/maps/${map.id}`}>
            <button
              className="btn btn-primary px-4 font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            >
              <Eye className="size-4" />
              <p className="text-white">View</p>
            </button>
          </Link>
          <Link to={`/`}>
            <button
              className="btn btn-secondary px-4 font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              onClick={() => {
                setSelectedMap(Number(map.id), map.map_name);
                toast.success(`${map.map_name} map selected successfully`, {
                  style: {
                    borderRadius: "6px",
                    background: "#333",
                    color: "#fff",
                  },
                });
              }}
            >
              <MousePointerClick className="size-4 text-white" />
              <p className="text-white">Select</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default MapCard;
