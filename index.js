const EpisodeMasterClass = require("./EpisodeMasterClass");
const express = require("express");
const res = require("express/lib/response");
const episodeMasterList = new EpisodeMasterClass();

const app = express();

app.get("/:series/:episodeNumber", async (req, res) => {
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
    res.json(episodeMasterList.dbMovies);
});

app.get("/streaminfo", (req, res) => {
    res.json(episodeMasterList.streamStatus);
});

app.get("/allInfo", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(episodeMasterList);
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3001");
    episodeMasterList.startStream();
});
