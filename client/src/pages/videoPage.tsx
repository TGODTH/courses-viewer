import { useParams } from "react-router-dom";
import VideoJS from "../components/video";
import Player from "video.js/dist/types/player";
import { Box, Button, Divider, Title } from "@mantine/core";

const VideoPage = () => {
  const { "*": videoPath } = useParams();

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
      <Box>
        <Title order={2} lh="xs">
          {videoPath?.split("/").pop()?.slice(0, -4)}
        </Title>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />

        <Divider my="md" />

        <Title order={2} lh="xs">
          เอกสารการเรียน
        </Title>
        <Button
          component="a"
          href={
            (import.meta.env.MODE === "production"
              ? window.location.origin
              : "http://localhost:3000") +
            "/api/pdf/" +
            encodeURIComponent(videoPath || 0)
          }
          download
          variant="outline"
          color="blue"
          mt="md"
        >
          ดาวโหลด PDF
        </Button>
      </Box>
    </Box>
  );
};

export default VideoPage;
