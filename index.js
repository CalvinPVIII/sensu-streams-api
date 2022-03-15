const EpisodeMasterClass = require("./EpisodeMasterClass");
const express = require("express");
const res = require("express/lib/response");
const bodyParser = require("body-parser");
const episodeMasterList = new EpisodeMasterClass();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
// this is where all admin stuff will go, need to change from post to get
app.post("/admin", (req, res) => {
    if (req.body.token === 1234) {
        switch (req.body.action) {
            case "updateNonWorkingList":
                console.log(`updating ${req.body.data} in non working list`);
                break;

            case "changePlaylist":
                console.log(`changing to ${req.body.data} playlist`);
                break;

            case "setEpisode":
                console.log(
                    `setting current episode to ${req.body.data} in playlist`
                );
                break;

            case "updateStream":
                console.log("updatingStream");
                break;
        }
        // episodeMasterList.updateNonWorkingSources("Gogo");
        // console.log(req.body);
        res.end("Updated Backend");
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
