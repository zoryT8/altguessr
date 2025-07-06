import axios from "axios";
import { PlusCircleIcon, MapPin, CircleX } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../App";

interface FormData {
  mapName: string;
  desc: string;
  locationList: string[];
}

interface ModalProps {
  fetchMaps: () => Promise<void>;
}

function AddMapModal({ fetchMaps }: ModalProps) {
  const [formData, setFormData] = useState<FormData>({
    mapName: "",
    desc: "",
    locationList: [""],
  });

  const [loadingState, setLoadingState] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingState(true);

    try {
      await axios.post(`${BASE_URL}/api/maps`, formData);
      await fetchMaps();
      setFormData({ mapName: "", desc: "", locationList: [""] });
      toast.success("Map created successfully", {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });
      (document.getElementById("add_map_modal") as HTMLDialogElement).close();
    } catch (error) {
      console.log("Error in addmapmodal handlesubmit function", error);
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
  }

  return (
    <dialog id="add_map_modal" className="modal">
      <div className="modal-box max-h-10/12">
        {/* CLOSE BUTTON */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            X
          </button>
        </form>

        {/* MODAL HEADER */}
        <h3 className="font-bold text-xl mb-8">Create New Map</h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6">
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
                      {formData.locationList.length > 1 && (
                        <button
                          className="btn btn-square btn-ghost text-secondary"
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
          </div>

          {/* MODAL ACTIONS */}
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-ghost transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                Cancel
              </button>
            </form>
            <button
              type="submit"
              className="btn btn-primary min-w-[120px] transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              disabled={
                !formData.mapName ||
                formData.locationList.includes("") ||
                loadingState
              }
            >
              <>
                <PlusCircleIcon className="size-5" />
                Create Map
              </>
            </button>
          </div>
        </form>
      </div>

      {/* BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AddMapModal;
