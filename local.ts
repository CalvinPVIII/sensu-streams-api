import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import EpisodeHelper from "./src/EpisodeHelper.ts";
import Stream from "./src/Stream.ts";
import { episode, series } from "./src/Types";

const app = express();

const stream = new Stream();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// app.get("/episode/:series/:episodeNumber", async (req, res) => {
//   let episode = await episodeMasterList.getEpisode(
//     episodeMasterList[req.params.series][req.params.episodeNumber]
//   );
//   console.log(episode);
//   res.json(episode);
// });

// app.get("/movies", (req, res) => {
//   res.json(episodeMasterList.movies);
// });

// app.get("/movies/:series/", (req, res) => {
//   res.json(episodeMasterList.returnMoviesBySeries(req.params.series));
// });

// app.get("/movie/:series/:number", async (req, res) => {
//   let result = await episodeMasterList.returnMovie(
//     req.params.series,
//     req.params.number
//   );
//   res.json(result);
// });

// app.post("/admin", (req, res) => {
//   if (req.body.token === process.env.TOKEN) {
//     switch (req.body.action) {
//       case "updateNonWorkingList":
//         const listStatus = episodeMasterList.updateNonWorkingSources(
//           req.body.data
//         );
//         console.log(`${listStatus} ${req.body.data} in non working list`);
//         res.end(`${listStatus} ${req.body.data} in non working list`);
//         break;

//       case "changePlaylist":
//         const playlistStatus = episodeMasterList.changeStreamPlaylist(
//           req.body.data
//         );
//         console.log(playlistStatus);
//         res.end(playlistStatus);
//         break;

//       case "setEpisode":
//         const episodeStatus = episodeMasterList.setCurrentEpiosde(
//           req.body.data
//         );
//         console.log(episodeStatus);
//         res.end(episodeStatus);
//         break;

//       case "stopStream":
//         const stopStreamStatus = episodeMasterList.stopStream();
//         res.end(stopStreamStatus);
//         break;

//       case "startStream":
//         const startStreamStatus = episodeMasterList.startStream();
//         res.end(startStreamStatus);
//         break;
//     }
//   } else {
//     res.status(401).send("You do not have sufficient permissions");
//   }
// });

app.get("/stream", (req, res) => {
  res.json(stream);
});

// app.get("/allInfo", (req, res) => {
//   res.json(episodeMasterList);
// });

app.get("/episodes/:series", (req: express.Request, res: express.Response) => {
  const series: series = EpisodeHelper.series[req.params.series];
  if (series) {
    res.json(series);
  } else {
    res.status(400).send();
  }
});

app.get("/episodes/:series/:episodeNumber", (req: express.Request, res: express.Response) => {
  const series: series = EpisodeHelper.series[req.params.series];
  if (series) {
    // eventually will want to scrape url
    const episode: episode = series[parseInt(req.params.episodeNumber)];
    if (episode) {
      res.json(episode);
    } else {
      res.status(400).send();
    }
  } else {
    res.status(400).send();
  }
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running locally on port 3001");
  stream.startStream();
});

// run server using ts-node-esm local.ts
