import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Homepage from "./pages";
import VideoPage from "./pages/videoPage";
import CollapseSidebar from "./components/CollapseSidebar";
import { useEffect, useState } from "react";
import { IFileStructure } from "./types";
import axios from "axios";
import { CourseStructureContext } from "./services/context";
import { Modal, Button, Group } from "@mantine/core";

function App() {
  const [courseStructure, setCourseStructure] = useState<IFileStructure | null>(
    null
  );
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
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
    const lastPath = localStorage.getItem("lastPath");
    if (lastPath && lastPath !== decodeURIComponent(location.pathname)) {
      setShowModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmModal = () => {
    navigate(localStorage.getItem("lastPath") || "/");
    setShowModal(false);
  };

  return (
    <CourseStructureContext.Provider value={courseStructure}>
      <Routes>
        <Route element={<CollapseSidebar />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/video/*" element={<VideoPage />} />
        </Route>
      </Routes>
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="ดูต่อจากเดิม?"
        size="auto"
        centered
      >
        <p>คุณต้องการเปิดหน้าล่าสุดจากครั้งก่อนหรือไม่</p>
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setShowModal(false)}>
            ไม่
          </Button>
          <Button onClick={handleConfirmModal} data-autofocus>
            ใช่
          </Button>
        </Group>
      </Modal>
    </CourseStructureContext.Provider>
  );
}

export default App;
