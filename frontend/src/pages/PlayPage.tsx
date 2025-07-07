import { House, ShieldAlert } from "lucide-react";
import LeafletMap from "../components/LeafletMap";
import MapillaryStreetViewer from "../components/MapillaryStreetViewer";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../App";
import axios from "axios";
import { useSelectedMapStore } from "../store/useSelectedMapStore";
import leaflet from "leaflet";
import RoundResultModal from "../components/RoundResultModal";
import type { LngLatAlt } from "mapillary-js";
import GameSummaryModal from "../components/GameSummaryModal";

export class RoundResult {
  score: number = 0;
  guessLocation: leaflet.LatLng | null = null;
  realLocation: LngLatAlt | null = null;
  locationId: string = "";
}

interface PlayPageProps {
  numRounds: number;
}

function PlayPage({ numRounds }: PlayPageProps) {
  const { selectedMapId, selectedMapName, setSelectedMap } =
    useSelectedMapStore();
  const navigate = useNavigate();
  const mapLocations = useRef<string[]>([]);
  const [guessLocationState, setGuessLocationState] =
    useState<leaflet.LatLng | null>(null);
  const [realLocationState, setRealLocationState] = useState<LngLatAlt | null>(
    null
  );

  const [roundNumberState, setRoundNumberState] = useState<number>(1);
  const [scoreState, setScoreState] = useState<number>(0);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [roundOverState, setRoundOverState] = useState<boolean>(false);

  function setGuessLocation(latlng: leaflet.LatLng) {
    if (roundOverState == false) {
      setGuessLocationState(latlng);
      setRoundOverState(true);
      (
        document.getElementById("round_result_modal") as HTMLDialogElement
      ).showModal();
    }
  }

  async function fetchGameLocations() {
    setLoadingState(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/maps/${selectedMapId}/random_locs/${numRounds}`
      );
      mapLocations.current = response.data.locations.map(
        (locObj: Record<string, any>) => locObj.location_id
      );

      while (mapLocations.current.length < numRounds) {
        const randomIndex = Math.floor(
          Math.random() * mapLocations.current.length
        );

        const randomLocationId = mapLocations.current[randomIndex];
        mapLocations.current.push(randomLocationId);
      }
    } catch (err) {
      setErrorState(true);
    } finally {
      setLoadingState(false);
    }
  }

  useEffect(() => {
    fetchGameLocations();
  }, []);

  if (loadingState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="bg-base-100 rounded-full p-6">
          <ShieldAlert className="size-12" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold ">Something went wrong.</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="btn btn-soft absolute top-2 left-2 z-1000 font-extrabold transition 
      duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        onClick={() => navigate("/")}
      >
        <House></House>AltGuessr
      </button>
      <div className="flex flex-col items-center gap-2 absolute top-2 right-2 z-1000">
        <div className="btn font-extrabold cursor-default">
          Score: {scoreState}
        </div>
        <div
          className="radial-progress bg-base-100 text-primary-content border-primary 
        border-4 font-extrabold"
          style={
            {
              "--value": Number((roundNumberState / numRounds) * 100),
            } as React.CSSProperties
          }
          aria-valuenow={Number((roundNumberState / numRounds) * 100)}
          role="progressbar"
        >
          {`Rd. ${roundNumberState}/${numRounds}`}
        </div>
      </div>
      {!loadingState && !errorState && (
        <div className="relative">
          <RoundResultModal
            scoreState={scoreState}
            roundNumberState={roundNumberState}
            locationId={mapLocations.current[roundNumberState - 1]}
            setScoreState={setScoreState}
            setRoundNumberState={setRoundNumberState}
            setRoundOverState={setRoundOverState}
            guessLocation={guessLocationState}
            realLocation={realLocationState}
            numRounds={numRounds}
          ></RoundResultModal>
          <GameSummaryModal
            totalScore={scoreState}
            roundResults={[]}
            numRounds={numRounds}
          ></GameSummaryModal>
          {mapLocations.current[roundNumberState - 1] && (
            <MapillaryStreetViewer
              accessToken={import.meta.env.VITE_MAPILLARY_ACCESS}
              imageId={mapLocations.current[roundNumberState - 1]}
              setRealLocation={setRealLocationState}
            ></MapillaryStreetViewer>
          )}
          <LeafletMap setGuessLocation={setGuessLocation}></LeafletMap>
        </div>
      )}
    </>
  );
}

export default PlayPage;
