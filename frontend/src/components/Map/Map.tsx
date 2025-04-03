import React, { useEffect, useRef, useState } from "react";
import Layers from "../../assets/images/layers-icon.svg";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import TileWMS from "ol/source/TileWMS.js";
import { get as getProjection } from "ol/proj.js";
import { getWidth } from "ol/extent.js";

// @ts-expect-error
const projExtent: any = getProjection("EPSG:3857").getExtent();
const startResolution = getWidth(projExtent) / 256;
const resolutions = new Array(22);
for (let i = 0, ii = resolutions.length; i < ii; ++i) {
  resolutions[i] = startResolution / Math.pow(2, i);
}

interface MapboxMapProps {
  data: any; 
}

const MapboxMap: React.FC<MapboxMapProps> = ({ data }) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // @ts-ignore

  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [currentStyle, setCurrentStyle] = useState("streets");
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const baseLayers: any = {
    streets: new TileLayer({ source: new OSM() }),
    satellite: new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
    }),
  };

  const [layerSelection, setLayerSelection] = useState<Record<string, boolean>>(
    {}
  );
  const [layerObjects, setLayerObjects] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data?.length > 0) {
      if (!mapRef.current && mapContainerRef.current) {
        const map = new Map({
          target: mapContainerRef.current,
          layers: [baseLayers.streets],
          view: new View({
            center: fromLonLat([-122.483033, 49.164362]),
            zoom: 18,
            maxZoom: 22,
            minZoom: 10,
          }),
        });

        mapRef.current = map;

        const layersMap: Record<string, any> = {};
        const initialSelection: Record<string, boolean> = {};

        data?.forEach((layer: any) => {
          let layerObj;
          if (layer.type === "raster") {
            layerObj = new ImageLayer({
              source: new ImageWMS({
                url: "http://44.244.10.225:8080/geoserver/ne/wms",
                params: {
                  LAYERS: layer.geoserver_link,
                  FORMAT: "image/png8",
                  VERSION: "1.1.1",
                },
                ratio: 1,
              }),
            });
          } else if (layer.type === "vector") {
            layerObj = new TileLayer({
              source: new TileWMS({
                url: "http://44.244.10.225:8080/geoserver/ne/wms",
                params: {
                  LAYERS: layer.geoserver_link,
                  FORMAT: "image/png8",
                  VERSION: "1.1.0",
                  SRS: "EPSG:4326",
                  TRANSPARENT: true,
                },
                serverType: "geoserver",
              }),
            });
          }

          if (layerObj) {
            layersMap[layer.geoserver_link] = layerObj;
            initialSelection[layer.geoserver_link] = true;
            map.addLayer(layerObj);
          }
        });
        

        setLayerObjects(layersMap);
        setLayerSelection(initialSelection);
      }
    }
  }, [data]);

  const changeLayer = (style: any) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const layers = map.getLayers();

    layers.getArray().forEach((layer) => {
      if (Object.values(baseLayers).includes(layer)) {
        map.removeLayer(layer);
      }
    });

    const newBaseLayer = baseLayers[style];
    map.addLayer(newBaseLayer);

    setTimeout(() => {
      Object.entries(layerSelection).forEach(([layerName, isSelected]) => {

        const layerObj = layerObjects[layerName];

        if (!layerObj) return;

        const mapLayers = map.getLayers().getArray();

        if (isSelected) {
          if (!mapLayers.includes(layerObj)) {
            map.addLayer(layerObj);
          } else {
            map.removeLayer(layerObj);
            map.addLayer(layerObj);
          }
        } else {
          if (mapLayers.includes(layerObj)) {
            map.removeLayer(layerObj);
          }
        }
      });
    }, 200);

    setCurrentStyle(style);
    setShowLayerMenu(false);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const layers = map.getLayers();

    Object.entries(layerSelection).forEach(([layerName, isSelected]) => {
      const layerObj = layerObjects[layerName];

      if (!layerObj) return;

      if (isSelected) {
        if (!layers.getArray().includes(layerObj)) {
          map.addLayer(layerObj);
        }
      } else {
        map.removeLayer(layerObj);
      }
    });
  }, [layerSelection, layerObjects]);

  const toggleLayer = (layerName: string) => {
    setLayerSelection((prev) => {
      const newSelection = { ...prev, [layerName]: !prev[layerName] };

      if (mapRef.current) {
        const map = mapRef.current;
        const layers = map.getLayers().getArray();
        const layerObj = layerObjects[layerName];

        if (layerObj) {
          if (newSelection[layerName]) {
            if (!layers.includes(layerObj)) {
              map.addLayer(layerObj);
            }
          } else {
            map.removeLayer(layerObj);
          }
        }
      }

      return newSelection;
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "92vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "6px",
          padding: "8px",
        }}>
        {Object.keys(baseLayers).map((layer) => (
          <button
            key={layer}
            onClick={() => changeLayer(layer as keyof typeof baseLayers)}
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              textAlign: "left",
              backgroundColor:
                currentStyle === layer ? "rgb(5, 150, 105)" : "#fff",
              color: currentStyle === layer ? "#fff" : "#000",
              border: "none",
              cursor: "pointer",
            }}>
            {layer.charAt(0).toUpperCase() + layer.slice(1)}
          </button>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          width: "auto",
        }}>
        <button
          style={{
            borderRadius: "6px",
            cursor: "pointer",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowTypeMenu((prev) => !prev)}>
          <img
            src={Layers}
            alt="Layers"
            style={{ width: "100%", height: "100%" }}
          />
        </button>

        {showTypeMenu && (
          <div
            style={{
              marginTop: "8px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "6px",
              padding: "8px",
            }}>
            {data.map((layer: any) => (
              <label
                key={layer.geoserver_link}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                  cursor: "pointer",
                }}>
                <input
                  type="checkbox"
                  checked={layerSelection[layer.geoserver_link] || false}
                  onChange={() => toggleLayer(layer.geoserver_link)}
                  style={{ accentColor: "rgb(5, 150, 105)" }}
                />
                {layer.name.charAt(0).toUpperCase() + layer.name.slice(1)} 
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxMap;
