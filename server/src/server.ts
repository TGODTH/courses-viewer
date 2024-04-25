import express from "express";
import fs from "fs";
import path from "path";
import fg from "fast-glob";
import { buildFileStructure } from "./utils";
import cors from "cors";
import https from "https";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const cert = process.env.CERT_PATH || "cert/your_domain_name.crt";
const key = process.env.KEY_PATH || "cert/private.key";
const ca = process.env.CA_PATH || "cert/CARootCertificate-ca.crt";
const fileMainPath =
  process.env.FILE_MAIN_PATH ||
  "D:\\Project\\Website\\Work\\SLH\\english-course\\server\\video";

const app = express();

app.use(cors());

app.get("/api/list", async (req, res) => {
  const excludedFileTypes = process.env.EXCLUDED_FILE_TYPES!;
  try {
    const files = fg.sync(["**/*", `!**/*{${excludedFileTypes}}`], {
      cwd: fileMainPath,
    });
    const fileStructure = buildFileStructure(files);
    res.send(fileStructure);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/api/video/*", (req, res) => {
  const videoPath = path.join(
    fileMainPath,
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
app.get("/api/download/*", (req, res) => {
  const filePath = path.join(
    fileMainPath,
    decodeURIComponent((req.params as { [key: string]: string })["0"])
  );

  if (filePath.toLowerCase().endsWith(".mp4")) {
    return res.status(404).send("MP4 file not allowed for direct download");
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const head = {
    "Content-Length": fileSize,
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
  };
  if (filePath.endsWith(".pdf")) return res.sendFile(filePath);

  res.writeHead(200, head);
  fs.createReadStream(filePath).pipe(res);
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
    console.log("Failed to get HTTPS cert file... Serve as HTTP instead")
  app.listen(PORT, () => {
    console.log(`now listen on port ${PORT}`);
  });
}
