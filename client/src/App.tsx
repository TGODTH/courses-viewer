import { Routes, Route } from "react-router-dom";
import Homepage from "./pages";
import VideoPage from "./pages/videoPage";
import CollapseSidebar from "./components/CollapseSidebar";
import { useEffect, useState } from "react";
import { IFileStructure } from "./types";
import axios from "axios";
import { CourseStructureContext } from "./services/context";

function App() {
  const [courseStructure, setCourseStructure] = useState<IFileStructure | null>(
    null
  );

  useEffect(() => {
    axios
      .get(
        (import.meta.env.MODE === "production"
          ? window.location.origin
          : "http://localhost:3000") + "/api/list"
      )
      .then((response) => {
        setCourseStructure(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <CourseStructureContext.Provider value={courseStructure}>
      <Routes>
        <Route element={<CollapseSidebar />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/video/*" element={<VideoPage />} />
        </Route>
      </Routes>
    </CourseStructureContext.Provider>
  );
}

export default App;
