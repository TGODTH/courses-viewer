import express from "express";
import fs from "fs";
import path from "path";
import fg from "fast-glob";
import { buildFileStructure } from "./utils";
import cors from "cors";
import https from "https";

const PORT = 3000;
const cert = "cert/your_domain_name.crt";
const key = "cert/private.key";
const ca = "cert/CARootCertificate-ca.crt";
const videoMainPath = "D:\\Project\\Website\\Work\\SLH\\english-course\\server\\video";

const app = express();

app.use(cors());

app.get("/api/list", async (req, res) => {
  try {
    const files = fg.sync("**/*", { cwd: videoMainPath });
    const fileStructure = buildFileStructure(files);
    res.send(fileStructure);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/api/video/*", (req, res) => {
  const videoPath = path.join(
    videoMainPath,
    decodeURIComponent((req.params as { [key: string]: string })["0"])
  );
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});
app.get("/api/pdf/*", (req, res) => {
  const videoPath = path.join(
    videoMainPath,
    decodeURIComponent((req.params as { [key: string]: string })["0"])
  );

  const videoDir = path.dirname(videoPath);
  const files = fg.sync("*", { cwd: videoDir });
  const pdfFile = files.find((file) => {
    const [firstNum] = file.split(".");
    return (
      firstNum === videoPath.split("\\").pop()?.split(".")[0] &&
      file.slice(-4) === ".pdf"
    );
  });

  if (!pdfFile) {
    return res.status(404).send("PDF file not found");
  }

  const pdfPath = path.join(videoDir, pdfFile);
  const stat = fs.statSync(pdfPath);
  const fileSize = stat.size;

  const head = {
    "Content-Length": fileSize,
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${pdfFile}"`,
  };

  res.writeHead(200, head);
  fs.createReadStream(pdfPath).pipe(res);
});

app.use(express.static("./public"));

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

try {
  const httpsServer = https.createServer(
    {
      cert: fs.readFileSync(cert, "utf-8"),
      key: fs.readFileSync(key, "utf-8"),
      ca: fs.readFileSync(ca, "utf-8"),
    },
    app
  );
  httpsServer.listen(PORT, () => {
    console.log(`now listen on port ${PORT}`);
  });
} catch (error) {
  app.listen(PORT, () => {
    console.log(`now listen on port ${PORT}`);
  });
}
