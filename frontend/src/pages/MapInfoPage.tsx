import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CircleX,
  MapPin,
  SaveIcon,
  ShieldAlert,
  Trash2Icon,
  View,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../App";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

interface MapData {
  mapName: string;
  desc: string;
  locationList: string[];
  numLocations: number;
  mapCreator: string;
  numPlays: number;
}

function MapInfoPage() {
  const [mapData, setMapData] = useState<MapData>({
    mapName: "",
    desc: "",
    locationList: [""],
    numLocations: 0,
    mapCreator: "Guest",
    numPlays: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string>();

  const fetchMap = async () => {
    setLoadingState(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/maps/${id}`);
      const mapInfo = response.data.data;
      const locations: string[] = response.data.locations.map(
        (locObj: Record<string, any>) => locObj.location_id
      );
      setMapData({
        mapName: mapInfo.map_name || "",
        desc: mapInfo.description || "",
        locationList: locations || [],
        numLocations: locations.length || 0,
        mapCreator: mapInfo.map_creator || "Guest",
        numPlays: mapInfo.total_plays,
      });
    } catch (err) {
      setErrorState("Something went wrong");
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchMap();
  }, [id]);

  if (loadingState) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!mapData || errorState) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="bg-base-100 rounded-full p-6">
          <ShieldAlert className="size-12" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold ">
            No matching map was found.
          </h3>
        </div>
      </div>
    );
  }

  //   if (errorState) {
  //     return (
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="alert alert-error">{errorState}</div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen max-h-screen overflow-auto">
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card bg-base-100 shadow-lg max-h-10/12 overflow-auto">
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title text-2xl mb-6">
                Map:{" "}
                <span className="text-accent font-extrabold">
                  {mapData.mapName}
                </span>
              </h2>

              <button
                onClick={() => navigate("/maps")}
                className="btn btn-ghost mb-4"
              >
                <ArrowLeftIcon className="size-4 mr-2" />
                Back to Maps
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="label">
                  <span className="label-text text-accent font-bold text-xl">
                    Map Creator
                  </span>
                </label>
                <div className="relative text-lg font-semibold">
                  {mapData.mapCreator}
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-accent font-bold text-xl">
                    Map Description
                  </span>
                </label>
                <div className="relative text-lg font-semibold">
                  {mapData.desc}
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-accent font-bold text-xl">
                    Number of Plays
                  </span>
                </label>
                <div className="relative text-lg font-semibold">
                  {mapData.numPlays}
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-accent font-bold text-xl">
                    Number of Locations
                  </span>
                </label>
                <div className="relative text-lg font-semibold">
                  {mapData.numLocations}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MapInfoPage;
