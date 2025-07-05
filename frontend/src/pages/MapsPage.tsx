import { useEffect, useState } from "react";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../App";
import MapCard from "../components/MapCard";
import Navbar from "../components/Navbar";
import AddMapModal from "../components/AddMapModal";

function MapsPage() {
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [mapsState, setMapsState] = useState<Record<string, any>[]>([]);
  const [errorState, setErrorState] = useState<string>();

  const fetchMaps = async () => {
    setLoadingState(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/maps`);
      setMapsState(response.data.data);
    } catch (err) {
      setErrorState("Something went wrong");
      setMapsState([]);
    } finally {
      setLoadingState(false);
    }
  };

  const deleteMap = async () => {};

  useEffect(() => {
    fetchMaps();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <main className="max-w-6xl mx-auto px-4 py-8 ">
        <div className="flex justify-between items-center mb-8">
          <AddMapModal fetchMaps={fetchMaps} />
          <button
            className="btn btn-primary transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            onClick={() =>
              (
                document.getElementById("add_map_modal") as HTMLDialogElement
              ).showModal()
            }
          >
            <PlusCircleIcon className="size-5 mr-1" />
            Create Map
          </button>
          <button className="btn btn-ghost btn-circle" onClick={fetchMaps}>
            <RefreshCwIcon className="size-5" />
          </button>
        </div>
        {errorState && (
          <div className="alert alert-error mb-8">{errorState}</div>
        )}
        {mapsState.length === 0 && !loadingState && (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="bg-base-100 rounded-full p-6">
              <PackageIcon className="size-12" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold ">No maps found</h3>
            </div>
          </div>
        )}
        {loadingState ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mapsState?.map((map) => (
              <MapCard key={map.id} map={map} deleteMap={deleteMap} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
export default MapsPage;
