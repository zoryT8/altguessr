import {
  EditIcon,
  Trash2Icon,
  Play,
  Eye,
  MousePointerClick,
  Gamepad2,
  Pencil,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelectedMapStore } from "../store/useSelectedMapStore";
import toast from "react-hot-toast";
import { useUserStore } from "../store/useUserStore";

interface MapCardProps {
  map: Record<string, any>;
  deleteMap: (id: number) => void;
}

function MapCard({ map, deleteMap }: MapCardProps) {
  const { username } = useUserStore();
  const { setSelectedMap } = useSelectedMapStore();
  const navigate = useNavigate();

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        {/* MAP INFO */}
        <div className="flex justify-between items-center">
          <h2 className="card-title text-2xl font-bold text-accent truncate">
            {map.map_name}
          </h2>
          <div
            className="flex items-center tooltip tooltip-accent"
            data-tip="Total map plays"
          >
            <p className="text-lg font-semibold text-wrap">{map.total_plays}</p>
            <Gamepad2 className="size-5 ml-1.5 text-accent"></Gamepad2>
          </div>
        </div>
        <p className="text-lg break-words whitespace-normal line-clamp-3">
          Creator:{" "}
          <span className="font-bold">
            {map.map_creator ? map.map_creator : "Guest"}
          </span>
        </p>

        {/* CARD ACTIONS */}
        <div className="flex justify-between">
          <div className="card-actions justify-start mt-4">
            {username === map.map_creator && (
              <button
                className="btn btn-primary px-4 font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                onClick={() => navigate(`/maps/edit/${map.id}`)}
              >
                <Pencil className="size-4" />
                <p className="text-white">Edit</p>
              </button>
            )}
          </div>
          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-accent px-4 font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              onClick={() => navigate(`/maps/${map.id}`)}
            >
              <Eye className="size-4" />
              <p className="text-white">Info</p>
            </button>
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
                navigate("/");
              }}
            >
              <MousePointerClick className="size-4 text-white" />
              <p className="text-white">Select</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MapCard;
