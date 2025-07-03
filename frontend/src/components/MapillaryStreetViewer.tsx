import React, { useEffect, useRef } from "react";
import { TransitionMode, Viewer } from "mapillary-js";

interface ViewerProps {
  accessToken: string;
  imageId: string;
  style?: React.CSSProperties;
}

function MapillaryStreetViewer({ accessToken, imageId, style }: ViewerProps) {
  if (!style) {
    style = { width: "100%", height: "100vh" };
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      // for removing attribution so players can't cheat
      const photoLink = containerRef.current?.querySelector(
        ".mapillary-attribution-username"
      );
      const photoDate = containerRef.current?.querySelector(
        ".mapillary-attribution-date"
      );

      if (photoLink && photoLink.parentNode) {
        photoLink.parentNode.removeChild(photoLink);
        observer.disconnect(); // Stop observing after removal
      }

      if (photoDate && photoDate.parentNode) {
        photoDate.parentNode.removeChild(photoDate);
        observer.disconnect();
      }
    });

    if (containerRef.current) {
      viewerRef.current = new Viewer({
        accessToken,
        container: containerRef.current,
        imageId,
        component: { cover: false },
        transitionMode: TransitionMode.Instantaneous,
      });

      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      viewerRef.current?.remove();
      observer.disconnect();
    };
  }, [accessToken, imageId]);

  useEffect(() => {
    async function getCoordinates() {
      if (!viewerRef.current) return;
      const reference = await viewerRef.current.getReference();
      console.log("Coordinates:", reference.lat, reference.lng);
    }

    getCoordinates();
  }, [imageId]); // Runs when a new image is loaded

  return (
    <>
      <div ref={containerRef} style={style} />
    </>
  );
}

export default MapillaryStreetViewer;
