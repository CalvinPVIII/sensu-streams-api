const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const cheerio = require("cheerio");

const {
    dragonBallSuper,
    dragonBallKai,
    dragonBall,
    dragonBallGt,
    dragonBallZ,
    streamPlaylist,
} = require("./episodes");

class EpisodeMasterClass {
    constructor() {
        this.db = dragonBall;
        this.dbz = dragonBallZ;
        this.dbkai = dragonBallKai;
        this.dbs = dragonBallSuper;
        this.dbgt = dragonBallGt;
        this.dbMovies = "Coming soon";
        this.streamPlaylist = streamPlaylist;

        this.streamStatus = {
            currentSubFiles: "",
            currentDubFiles: "",
            currentEpisode: 166,
            currentTime: 1200,
            episodeInfo: "",
            isInitialized: false,
            episodeDuration: 0,
            dubDuration: 0,
            subDuration: 0,
            failedToLoadVideo: false,
            dubLoadError: false,
            subLoadError: false,
        };
    }

    async getEpisodeGogoApi(url) {
        try {
            const { data } = await axios.get(url);
            return data.data;
        } catch (error) {
            console.log("error");
            console.log(error);
            return "error";
        }
    }

    async kimAnimeScrape(url) {
        try {
            const data = await axios.get(url);
            const $ = cheerio.load(data.data);
            const page = $.html();
            const link = page.match(/(?<=embed)(.*?)(?=&quot)/gm)[0].slice(1);

            const embedPage = await axios.get(
                "https://kimanime.com/episode/embed" + link
            );
            const $$ = cheerio.load(embedPage.data);
            const video = $$("video");

            let files = [];
            Object.values(video.children("source")).forEach((child) => {
                if (child.attribs && !child.attribs.src.includes("gogo-cdn")) {
                    const fileObj = {
                        file: child.attribs.src,
                        label: child.attribs.size,
                        type: child.attribs.type,
                    };
                    files.push(fileObj);
                }
            });

            return files;
        } catch (error) {
            console.log("error");
            console.log(error);
            return "error";
        }
    }

    owlOrganizer(url) {
        return [
            {
                file: url,
                label: "Auto",
                type: "mp4",
            },
        ];
    }

    startStream() {
        console.log("Starting video stream");
        this.handleVideoStream();
    }

    getDuration(episode) {
        return new Promise((resolve) => {
            try {
                ffmpeg.ffprobe(episode, (error, metadata) => {
                    if (metadata) {
                        resolve(metadata.format.duration);
                        console.log("Duration: " + metadata.format.duration);
                    } else {
                        resolve("error " + error);
                    }
                });
            } catch {
                console.log(error);
            }
        });
    }

    // this is used to get every episode length for a given object
    async getAllDuration(episodeObject) {
        for (const episode in episodeObject) {
            let dubLength = await this.getDuration(
                episodeObject[episode].dub.video
            );
            episodeObject[episode].dub.episodeLength = dubLength;
            let subLength = await this.getDuration(
                episodeObject[episode].sub.video
            );
            episodeObject[episode].sub.episodeLength = subLength;
            console.log(episodeObject[episode]);
        }
    }

    setCurrentSeriesInfo(dubSeriesUrl) {
        if (dubSeriesUrl.includes("movie")) {
            let series = dubSeriesUrl.substring(dubSeriesUrl.indexOf("/d") + 1);
            this.streamStatus.currentSeries = series
                .substring(0, series.indexOf("-movie"))
                .replace(/-/g, " ");
            this.streamStatus.currentEpisodeInSeries = series
                .substring(series.indexOf("-m"), series.indexOf("-dub"))
                .replace(/-/g, " ")
                .substring(1);
        } else {
            let series = dubSeriesUrl.substring(dubSeriesUrl.indexOf("/d") + 1);
            this.streamStatus.currentSeries = series
                .substring(0, series.indexOf("-dub"))
                .replace(/-/g, " ");
            this.streamStatus.currentEpisodeInSeries = dubSeriesUrl
                .split("-")
                .pop();
        }
    }

    async initializeEpisode() {
        console.log("Initializing episode");
        this.streamStatus.isInitialized = false;
        let currentSubSources =
            this.streamPlaylist[this.streamStatus.currentEpisode].sub.sources;
        let subEpisodeDuration =
            this.streamPlaylist[this.streamStatus.currentEpisode].sub
                .episodeLength;

        let currentDubSources =
            this.streamPlaylist[this.streamStatus.currentEpisode].dub.sources;
        let dubEpisodeDuration =
            this.streamPlaylist[this.streamStatus.currentEpisode].dub
                .episodeLength;
        this.streamStatus.subDuration = subEpisodeDuration;
        this.streamStatus.dubDuration = dubEpisodeDuration;
        this.streamStatus.episodeInfo =
            this.streamPlaylist[this.streamStatus.currentEpisode].episodeInfo;
        // this.setCurrentSeriesInfo(currentDubEpisode);
        // try {
        // this gets and organizes the files for each source
        let subFiles = [];
        let dubFiles = [];
        currentSubSources.forEach(async (source) => {
            if (source.source === "Anime Owl") {
                let obj = {
                    source: "Anime Owl",
                    files: this.owlOrganizer(source.video),
                };
                subFiles.push(obj);
            }
            if (source.source === "Gogoanime") {
                const gogoFiles = await this.getEpisodeGogoApi(source.video);
                const obj = {
                    source: "Gogoanime",
                    files: gogoFiles,
                };
                subFiles.push(obj);
            }
            if (source.source === "KimAnime") {
                const kimFiles = await this.kimAnimeScrape(source.video);

                const obj = {
                    source: "KimAnime",
                    files: kimFiles,
                };
                subFiles.push(obj);
            }
        });

        currentDubSources.forEach(async (source) => {
            if (source.source === "Anime Owl") {
                let obj = {
                    source: "Anime Owl",
                    files: this.owlOrganizer(source.video),
                };
                dubFiles.push(obj);
            }
            if (source.source === "Gogoanime") {
                const gogoFiles = await this.getEpisodeGogoApi(source.video);
                const obj = {
                    source: "Gogoanime",
                    files: gogoFiles,
                };
                dubFiles.push(obj);
            }
            if (source.source === "KimAnime") {
                const kimFiles = await this.kimAnimeScrape(source.video);
                const obj = {
                    source: "KimAnime",
                    files: kimFiles,
                };
                dubFiles.push(obj);
            }
        });

        this.streamStatus.currentDubFiles = dubFiles;
        this.streamStatus.currentSubFiles = subFiles;

        // this sets the episode duration
        if (subEpisodeDuration >= dubEpisodeDuration) {
            this.streamStatus.isInitialized = true;
            return subEpisodeDuration;
        } else {
            this.streamStatus.isInitialized = true;
            return dubEpisodeDuration;
        }
    }

    handleMoveToNextEpisode() {
        // reset the current time and move onto the next episode
        this.streamStatus.currentTime = 0;
        this.streamStatus.currentEpisode++;
        this.streamStatus.isInitialized = false;
        // if the next episode is outside of the array

        if (this.streamStatus.currentEpisode == this.streamPlaylist.length) {
            // reset the episodes to start at the beginning
            this.streamStatus.currentEpisode = 0;
        }
    }

    async handleVideoStream() {
        // this gets the episode duration if it hasn't already been initialized

        if (!this.streamStatus.isInitialized) {
            console.log("Handle video stream: streamStatus is not initialized");
            this.streamStatus.episodeDuration = await this.initializeEpisode();
            console.log(this.streamStatus.currentDubFiles);
        }
        console.log(`episode duration ${this.streamStatus.episodeDuration}`);
        console.log(`episode number ${this.streamStatus.currentEpisode}`);

        // this section is responsible for setting the max duration and updating the info in the class every second
        setTimeout(() => {
            // increase the current time every second
            this.streamStatus.currentTime++;
            console.log(this.streamStatus.currentTime);
            // if the current time is greater than or equal the max episode of the duration
            if (
                this.streamStatus.currentTime >=
                this.streamStatus.episodeDuration
            ) {
                this.handleMoveToNextEpisode();
                console.log(
                    `current episode is ${this.streamStatus.currentEpisode}`
                );
            }
            // call the function again to start the timer over
            this.handleVideoStream();
        }, 1000);
    }
}
module.exports = EpisodeMasterClass;
