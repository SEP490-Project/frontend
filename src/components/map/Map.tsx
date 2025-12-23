import { useEffect, useRef, useCallback } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useAppDispatch } from "@/libs/stores";
import { getDirections } from "@/libs/stores/goongManager/thunk";
import type { GoongDirectionRes } from "@/libs/types/goong";

goongjs.accessToken = import.meta.env.VITE_GOONG_MAPTILES_KEY;

// Decode Google's polyline encoding format used by Goong
const decodePolyline = (encoded: string): [number, number][] => {
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lng / 1e5, lat / 1e5]); // [lng, lat] for GeoJSON
  }

  return coordinates;
};

export const Map = ({ data }: { data: any }) => {
  const dispatch = useAppDispatch();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const mapLoadedRef = useRef<boolean>(false);
  const directionsRef = useRef<GoongDirectionRes | null>(null);

  // Draw route on map
  const drawRoute = useCallback((routeData: GoongDirectionRes) => {
    if (!mapRef.current || !mapLoadedRef.current) return;

    const route = routeData.routes?.[0];
    if (!route) {
      console.warn("No route found in directions response");
      return;
    }

    // Use overview_polyline for the complete route, or combine step polylines
    let coordinates: [number, number][] = [];

    if (route.overview_polyline?.points) {
      // Decode the overview polyline
      coordinates = decodePolyline(route.overview_polyline.points);
    } else {
      // Fallback: combine all step polylines
      coordinates =
        route.legs?.flatMap(
          (leg) =>
            leg.steps?.flatMap((step) =>
              step.polyline?.points ? decodePolyline(step.polyline.points) : [],
            ) ?? [],
        ) ?? [];
    }

    if (coordinates.length === 0) {
      console.warn("No coordinates found in route");
      return;
    }

    const geojson: any = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };

    try {
      if (mapRef.current.getSource("route")) {
        mapRef.current.getSource("route").setData(geojson);
      } else {
        mapRef.current.addSource("route", {
          type: "geojson",
          data: geojson,
        });
        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }

      // Fit map to show the entire route
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new goongjs.LngLatBounds(coordinates[0], coordinates[0]),
      );

      mapRef.current.fitBounds(bounds, {
        padding: 50,
      });
    } catch (error) {
      console.error("Error drawing route:", error);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapRef.current = new goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [data.from_location.long, data.from_location.lat],
      zoom: 15,
    });

    // Add start marker (blue - default)
    new goongjs.Marker()
      .setLngLat([data.from_location.long, data.from_location.lat])
      .addTo(mapRef.current);

    // Add end marker (red)
    new goongjs.Marker({ color: "red" })
      .setLngLat([data.to_location.long, data.to_location.lat])
      .addTo(mapRef.current);

    // Wait for map to load before drawing routes
    mapRef.current.on("load", () => {
      mapLoadedRef.current = true;
      // If directions already fetched, draw them using ref to avoid closure issue
      if (directionsRef.current) {
        drawRoute(directionsRef.current);
      }
    });

    return () => {
      mapLoadedRef.current = false;
      mapRef.current?.remove();
    };
  }, [
    data.from_location.lat,
    data.from_location.long,
    data.to_location.lat,
    data.to_location.long,
    drawRoute,
  ]);

  // Fetch directions
  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const result = await dispatch(
          getDirections({
            origin: `${data.from_location.lat},${data.from_location.long}`,
            destination: `${data.to_location.lat},${data.to_location.long}`,
            vehicle: `${data.tag[0]}`,
          }),
        );

        if (getDirections.fulfilled.match(result)) {
          const directionsData = result.payload as GoongDirectionRes;
          directionsRef.current = directionsData;

          // Draw route if map is already loaded
          if (mapLoadedRef.current) {
            drawRoute(directionsData);
          }
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    data.from_location.lat,
    data.from_location.long,
    data.to_location.lat,
    data.to_location.long,
    drawRoute,
  ]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }}></div>;
};
