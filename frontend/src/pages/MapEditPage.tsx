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

interface FormData {
  mapName: string;
  desc: string;
  locationList: string[];
  numLocations: number;
}

function MapEditPage() {
  const [formData, setFormData] = useState<FormData>({
    mapName: "",
    desc: "",
    locationList: [""],
    numLocations: 0,
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
      setFormData({
        mapName: mapInfo.map_name || "",
        desc: mapInfo.description || "",
        locationList: locations || [],
        numLocations: locations.length || 0,
      });
    } catch (err) {
      setErrorState("Something went wrong");
    } finally {
      setLoadingState(false);
    }
  };

  const deleteMap = async () => {
    setLoadingState(true);
    try {
      await axios.delete(`${BASE_URL}/api/maps/${id}`);
      toast.success("Product deleted successfully", {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log("Error in deleteProduct function", error);
      toast.error("Something went wrong", {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoadingState(false);
    }
  };

  const updateMap = async () => {
    setLoadingState(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/maps/${id}`, formData);
      toast.success("Map updated successfully", {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });
      console.log("Error in updateMap function", error);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchMap();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this map?")) {
      await deleteMap();
      navigate("/maps");
    }
  };

  if (loadingState) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!formData || errorState) {
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
        {/* MAP FORM */}
        <div className="card bg-base-100 shadow-lg max-h-10/12 overflow-auto">
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title text-2xl mb-6">Edit Map</h2>

              <button
                onClick={() => navigate("/maps")}
                className="btn btn-ghost mb-4"
              >
                <ArrowLeftIcon className="size-4 mr-2" />
                Back to Maps
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMap();
                navigate("/maps");
              }}
              className="space-y-6"
            >
              {/* MAP NAME INPUT */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-accent font-bold">
                    Map Name
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter map name"
                    className="input input-bordered w-full pl-4 py-3 focus:input-primary transition-colors duration-200"
                    value={formData.mapName}
                    onChange={(e) =>
                      setFormData({ ...formData, mapName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* MAP DESC INPUT */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-accent font-bold">
                    Description
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter description"
                    className="input input-bordered w-full pl-4 py-3 focus:input-primary transition-colors duration-200"
                    value={formData.desc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        desc: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* LOCATION IDS */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-accent font-bold">
                    Location IDs
                  </span>
                </label>
                <div className="relative max-h-36 overflow-y-auto">
                  <ul className="flex flex-col list bg-base-100 rounded-box shadow-md">
                    {formData.locationList.map((loc, index) => (
                      <li className="list-row items-center py-1">
                        <div className="text-lg font-bold">{index + 1}</div>
                        <input
                          type="text"
                          placeholder="Numeric key from https://www.mapillary.com/app"
                          className="input input-bordered w-full pl-4 py-3 focus:input-primary transition-colors duration-200"
                          value={formData.locationList[index]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              locationList: [
                                ...formData.locationList.slice(0, index),
                                e.target.value,
                                ...formData.locationList.slice(index + 1),
                              ],
                            })
                          }
                        />
                        <Link
                          to={`https://www.mapillary.com/app/?pKey=${loc}&focus=photo`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            !loc ? "pointer-events-none brightness-50" : ""
                          }
                        >
                          <div className="btn btn-square btn-ghost text-primary">
                            <View />
                          </div>
                        </Link>
                        {formData.locationList.length > 1 && (
                          <button
                            className="btn btn-square btn-ghost text-secondary "
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData({
                                ...formData,
                                locationList: formData.locationList.filter(
                                  (currentLoc, currentIndex) =>
                                    currentIndex != index
                                ),
                              });
                            }}
                          >
                            <CircleX />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="btn btn-ghost mt-2 text-white w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      locationList: [...formData.locationList, ""],
                    });
                  }}
                >
                  <MapPin />
                  Add Location
                </button>
              </div>

              {/* FORM ACTIONS */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                >
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Map
                </button>

                <button
                  type="submit"
                  className="btn btn-primary transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                  disabled={
                    !formData.mapName ||
                    formData.locationList.includes("") ||
                    loadingState
                  }
                >
                  {loadingState ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MapEditPage;
