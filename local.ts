import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// @ts-ignore
import cors_proxy from "cors-anywhere";

import EpisodeHelper from "./src/EpisodeHelper.ts";
import Stream from "./src/Stream.ts";

import { episode, series } from "./senzuTypes";
import axios from "axios";

const host = "0.0.0.0";
const port = 8080;
cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    // requireHeader: ['origin', 'x-requested-with'],
    // removeHeaders: ['cookie', 'cookie2']
  })
  .listen(port, host, function () {
    console.log("Running CORS Anywhere on " + host + ":" + port);
  });

dotenv.config();

const app = express();

const stream = new Stream();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/admin", (req, res) => {
  if (req.body.token && req.body.token === process.env.TOKEN) {
    switch (req.body.action) {
      case "start-stream":
        res.json({ message: stream.startStream() });
        break;
      case "stop-stream":
        res.json({ message: stream.stopStream() });
        break;
      case "set-episode":
        if (req.body.episodeNumber) {
          const result = stream.setCurrentEpisode(req.body.episodeNumber - 1); // - 1 because zero index array
          if (result === "success") {
            res.json(`Set episode to ${req.body.episodeNumber}`);
          } else {
            res.status(405).send("Cannot set episode number outside playlist range ");
          }
        } else {
          res.status(405).send("No episode number provided");
        }
        break;
    }
  } else {
    return res.status(401).send("You do not have sufficient permissions");
  }
});

app.get("/stream", (req, res) => {
  res.json(stream);
});

app.get("/:media", (req: express.Request, res: express.Response) => {
  const media = EpisodeHelper.getMedia(req.params.media);
  if (media) {
    res.json(media);
  } else {
    res.status(404).send("Not Found");
  }
});

app.get("/:media/:series", (req: express.Request, res: express.Response) => {
  const series = EpisodeHelper.getMedia(req.params.media, req.params.series);
  if (series) {
    res.json(series);
  } else {
    res.status(404).send("Unable to find series");
  }
});

app.get("/:media/:series/:episodeNumber", async (req: express.Request, res: express.Response) => {
  const series: series = EpisodeHelper.getMedia(req.params.media, req.params.series) as series;
  if (series) {
    const episode: episode = series[parseInt(req.params.episodeNumber)];
    if (episode) {
      const files = await EpisodeHelper.getEpisodeFiles(episode);
      if (files) {
        res.json({ episodeInfo: episode.episodeInfo, files: files });
      } else {
        res.status(500).send("There was an error getting files");
      }
    } else {
      res.status(404).send("Unable to find episode");
    }
  } else {
    res.status(404).send("Unable to find series");
  }
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running locally on port 3001");
});
