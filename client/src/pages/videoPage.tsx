import { useLocation, useParams } from "react-router-dom";
import VideoJS from "../components/video";
import Player from "video.js/dist/types/player";
import { Box, Title } from "@mantine/core";

const VideoPage = () => {
  const { "*": videoPath } = useParams();
  const location = useLocation();

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src:
          (import.meta.env.MODE === "production"
            ? window.location.origin
            : "http://localhost:3000") +
          "/api/video/" +
          // TODO: 0?
          encodeURIComponent(videoPath || 0),
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player: Player) => {
    // You can handle player events here, for example:
    player.on("waiting", () => {
      console.log("player is waiting");
    });
  };

  return (
    <Box mx="auto" maw="1200px" py="md">
      <Title order={2} lh="xs">
        {videoPath?.split("/").pop()?.slice(0, -4)}
      </Title>
      {location.pathname.endsWith(".mp4") ? (
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      ) : (
        <iframe
          title="Embedded PDF"
          src={
            (import.meta.env.MODE === "production"
              ? window.location.origin
              : "http://localhost:3000") +
            "/api/download/" +
            // TODO: 0?
            encodeURIComponent(videoPath || 0)
          }
          width="100%"
          style={{
            height:
              "calc(100svh - var(--app-shell-header-height) - var(--mantine-spacing-md) - 100px",
          }}
        />
      )}
    </Box>
  );
};

export default VideoPage;
