import { PlusCircleIcon, MapPin, CircleX, ArrowBigRight } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import leaflet from "leaflet";
import { type LngLatAlt } from "mapillary-js";
import { useNavigate } from "react-router-dom";
import type { RoundResult } from "../pages/PlayPage";

interface ModalProps {
  totalScore: number;
  roundResults: RoundResult[];
  numRounds: number;
}

function GameSummaryModal({ totalScore, roundResults, numRounds }: ModalProps) {
  const navigate = useNavigate();
  const mapRef = useRef<leaflet.Map | null>(null);

  const mapOptions: leaflet.MapOptions = {
    center: leaflet.latLng(0, 0),
    zoom: 1,
  };

  useEffect(() => {
    mapRef.current = leaflet.map("summary-map", mapOptions);

    leaflet
      .tileLayer(
        `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${
          import.meta.env.VITE_MAPTILER_KEY
        }`,
        {
          tileSize: 512,
          zoomOffset: -1,
          minZoom: 1,
          attribution:
            '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
          crossOrigin: true,
        }
      )
      .addTo(mapRef.current);

    // Destroy the instance should the component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <dialog id="game_summary_modal" className="modal z-1001">
      <div className="modal-box max-h-11/12 min-w-8/12 h-11/12 w-8/12">
        {/* MODAL MAP */}
        <h1 className="font-extrabold text-3xl text-center mb-4">
          Game Summary
        </h1>
        <div id="summary-map-container" className="h-7/12 w-full rounded-2xl">
          <div
            id="summary-map"
            className="relative size-full rounded-2xl z-100"
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="font-extrabold text-xl text-center mt-4 mb-4">
            X points
          </h3>
          <progress
            className="progress progress-accent w-11/12"
            value={0}
            max={`${5000 * numRounds}`}
          ></progress>
          <p className="mt-4 font-bold">
            You were
            <span className="text-secondary"> X </span>kilometers away from
            the&nbsp;
            <a
              href={`https://www.mapillary.com/app/?pKey=${0}&focus=photo`}
              target="_blank"
              className="transition duration-300 ease-in-out hover:text-secondary"
            >
              actual location
            </a>
            .
          </p>
          <form className="space-y-6" onSubmit={() => navigate("/")}>
            {/* MODAL ACTIONS */}
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                Finish
                <ArrowBigRight className="size-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default GameSummaryModal;
