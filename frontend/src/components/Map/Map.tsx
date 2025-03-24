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



const MapboxMap: React.FC = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // @ts-ignore

  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [currentStyle, setCurrentStyle] = useState("streets");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [activeLayers, setActiveLayers] = useState<ImageLayer<any>[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedLayerType, setSelectedLayerType] = useState<
    "raster" | "vector" | null
  >(null); 
  const [showVector, setShowVector] = useState(true);

  useEffect(() => {
    console.log("activeLayers", activeLayers);
  }, [activeLayers]);

  const baseLayers = {
    streets: new TileLayer({ source: new OSM() }),
    satellite: new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
    }),
  };

  const rasterLayer = new ImageLayer({
    source: new ImageWMS({
      url: "http://44.244.10.225:8080/geoserver/ne/wms",
      params: {
        LAYERS: "ne:bog-cranberry-20241118-1",
        FORMAT: "image/png",
        VERSION: "1.1.1",
      },
      ratio: 1,
    }),
  });

  const vectorLayer = new TileLayer({
    source: new TileWMS({
      url: "http://44.244.10.225:8080/geoserver/ne/wms",
      params: {
        LAYERS: "ne:_pred_all_merge",
        FORMAT: "image/png",
        VERSION: "1.1.0",
        SRS: "EPSG:4326",
        TRANSPARENT: true,
      },
      serverType: "geoserver",
    }),
  });

  useEffect(() => {
    console.log("showVector", showVector);
  }, [showVector]);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const map = new Map({
        target: mapContainerRef.current,
        layers: [baseLayers.streets, rasterLayer, vectorLayer], 
        view: new View({
          center: fromLonLat([-122.479761, 49.164222]), 
          zoom: 16,
          maxZoom: 25,
          minZoom: 10,
        }),
      });

      mapRef.current = map;

     
      setShowVector(false);
      // @ts-ignore

      setActiveLayers([rasterLayer, vectorLayer]);
      setSelectedLayerType(null);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
     
    }
  }, [showVector]);

  const changeLayer = (style: keyof typeof baseLayers) => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.getLayers().clear();
      map.addLayer(baseLayers[style]); // Set new base layer

      if (selectedLayerType === "raster") {
        // rasterLayer.setOpacity(1);

        map.addLayer(rasterLayer);
        map.addLayer(vectorLayer);
      } else if (selectedLayerType === "vector") {
        // vectorLayer.setOpacity(1);

        map.addLayer(vectorLayer);
        map.addLayer(rasterLayer);
      }

      setCurrentStyle(style);
      setShowLayerMenu(false);
    }
  };

  const simulateAPICall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const toggleLayer = async (type: "raster" | "vector") => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    setLoading(true);

    try {
      await simulateAPICall();

      if (selectedLayerType === type) {
        setSelectedLayerType(null);
        if (type === "raster") {
          map.removeLayer(rasterLayer);
        } else {
          map.removeLayer(vectorLayer);
        }
      } else {
        setSelectedLayerType(type);
        if (type === "raster") {
          map.addLayer(rasterLayer);
          map.removeLayer(vectorLayer);
        } else {
          map.addLayer(vectorLayer);
          map.removeLayer(rasterLayer);
        }
      }
    } catch (error) {
      console.error("Error toggling layer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "92vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background
            padding: "20px",
            borderRadius: "8px",
          }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #3b82f6",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}></div>
          <style>
            {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
          </style>
        </div>
      )}

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
            <button
              onClick={() => toggleLayer("raster")}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                textAlign: "left",
                backgroundColor:
                  selectedLayerType === "raster" ? "rgb(5, 150, 105)" : "#fff",
                color: selectedLayerType === "raster" ? "#fff" : "#000",
                border: "none",
                cursor: "pointer",
              }}>
              Raster Layer
            </button>
            <button
              onClick={() => toggleLayer("vector")}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                textAlign: "left",
                backgroundColor:
                  selectedLayerType === "vector" ? "rgb(5, 150, 105)" : "#fff",
                color: selectedLayerType === "vector" ? "#fff" : "#000",
                border: "none",
                cursor: "pointer",
              }}>
              Vector Layer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxMap;
