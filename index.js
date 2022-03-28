const EpisodeMasterClass = require("./EpisodeMasterClass");
const express = require("express");
const res = require("express/lib/response");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const episodeMasterList = new EpisodeMasterClass();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/episode/:series/:episodeNumber", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let episode = await episodeMasterList.getEpisode(
        episodeMasterList[req.params.series][req.params.episodeNumber]
    );
    console.log(episode);
    res.json(episode);
});

app.get("/db", (req, res) => {
    res.json(episodeMasterList.db);
});

app.get("/dbz", (req, res) => {
    res.json(episodeMasterList.dbz);
});
app.get("/dbkai", (req, res) => {
    res.json(episodeMasterList.dbkai);
});
app.get("/dbs", (req, res) => {
    res.json(episodeMasterList.dbs);
});

app.get("/dbgt", (req, res) => {
    res.json(episodeMasterList.dbgt);
});

app.get("/movies", (req, res) => {
    res.json(episodeMasterList.movies);
});

app.get("/movies/:series/", (req, res) => {
    res.json(episodeMasterList.returnMoviesBySeries(req.params.series));
});

app.get("/movie/:series/:number", async (req, res) => {
    let result = await episodeMasterList.returnMovie(
        req.params.series,
        req.params.number
    );
    res.json(result);
});

app.post("/admin", (req, res) => {
    if (req.body.token === process.env.TOKEN) {
        console.log("post");
        switch (req.body.action) {
            case "updateNonWorkingList":
                const listStatus = episodeMasterList.updateNonWorkingSources(
                    req.body.data
                );
                console.log(
                    `${listStatus} ${req.body.data} in non working list`
                );
                res.end(`${listStatus} ${req.body.data} in non working list`);
                break;

            case "changePlaylist":
                const playlistStatus = episodeMasterList.changeStreamPlaylist(
                    req.body.data
                );
                console.log(playlistStatus);
                res.end(playlistStatus);
                break;

            case "setEpisode":
                const episodeStatus = episodeMasterList.setCurrentEpiosde(
                    req.body.data
                );
                console.log(episodeStatus);
                res.end(episodeStatus);
                break;

            case "stopStream":
                const stopStreamStatus = episodeMasterList.stopStream();
                res.end(stopStreamStatus);
                break;

            case "startStream":
                const startStreamStatus = episodeMasterList.startStream();
                res.end(startStreamStatus);
                break;
        }
    } else {
        res.end("You do not have sufficient permissions");
    }
});

app.get("/streaminfo", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(episodeMasterList.streamStatus);
});

app.get("/allInfo", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(episodeMasterList);
});

app.listen(3001, "0.0.0.0", () => {
    console.log("Server running on port 3000");
    episodeMasterList.startStream();
});
