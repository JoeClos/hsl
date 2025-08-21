import { useEffect, useLayoutEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";
import { api } from "../service/api";
import icon from "../icon";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function useChromeOffsets(isMobile) {
  const [offsets, setOffsets] = useState({ top: 0, bottom: 0 });

  useLayoutEffect(() => {
    if (!isMobile) {
      setOffsets({ top: 0, bottom: 0 });
      return;
    }

    const measure = () => {
      const mainEl = document.querySelector("[data-app-main]");
      const navEl = document.querySelector("[data-bottom-nav]");

      const top = mainEl
        ? Math.max(0, Math.round(mainEl.getBoundingClientRect().top))
        : 0;

      const navH = navEl
        ? Math.round(navEl.getBoundingClientRect().height)
        : 56;

      const safeBottom =
        Number(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--safe-area-bottom")
            .replace("px", "")
        ) || 0;

      setOffsets({ top, bottom: navH + safeBottom });
    };

    measure();

    const ro = new ResizeObserver(measure);
    const mainEl = document.querySelector("[data-app-main]");
    const navEl = document.querySelector("[data-bottom-nav]");
    mainEl && ro.observe(mainEl);
    navEl && ro.observe(navEl);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [isMobile]);

  return offsets;
}

const HomePageMap = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { top, bottom } = useChromeOffsets(isMobile);

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${api}/stations`)
      .then((res) => setStations(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", height: "100dvh" }}>
        Loading…
      </Box>
    );
  }

  const containerSx = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        top, // top edge of main content
        bottom, // top edge of bottom nav
        width: "100vw",
        backgroundColor: "background.default",
        zIndex: 0,
      }
    : {
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
      };

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", height: "100dvh" }}>
        Loading…
      </Box>
    );
  }

  return (
    <>
      <style>{`
        :root { --safe-area-bottom: env(safe-area-inset-bottom, 0px); }
      `}</style>

      <Box sx={containerSx}>
        <MapContainer
          center={[60.1699, 24.9384]}
          zoom={12}
          scrollWheelZoom
          style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading>
            {stations.map((s, i) => (
              <Marker
                key={s._id || `${s.id}-${s.x}-${s.y}` || `station-${i}`}
                position={[s.y, s.x]}
                title={s.nimi}
                icon={icon}
              >
                <Popup>{s.nimi}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </Box>
    </>
  );
};

export default HomePageMap;
