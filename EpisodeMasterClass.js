const ffmpeg = require("fluent-ffmpeg");
let scraper = require("./scraper");
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
            currentEpisode: 0,
            currentTime: 1375,
            currentSeries: "",
            currentEpisodeInSeries: "",
            isInitialized: false,
            episodeDuration: 0,
            dubDuration: 0,
            subDuration: 0,
            failedToLoadVideo: false,
            dubLoadError: false,
            subLoadError: false,
        };

        // this is what the stream is using for the video playlist. It is an array of objects
    }

    async getEpisodeFiles(episodeLink) {
        try {
            let files = await scraper.getMediaSources(episodeLink);
            return files;
        } catch (error) {
            console.log("There was an error: " + error);
        }
    }

    async getEpisode(episode) {
        try {
            episode.dub.files = await scraper.getMediaSources(
                episode.dub.video
            );
            episode.sub.files = await scraper.getMediaSources(
                episode.sub.video
            );
            return episode;
        } catch (error) {
            console.log("There was an error: " + error);
        }
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

    initializeEpisode() {
        console.log("Initializing episode");
        this.streamStatus.isInitialized = false;
        let currentSubEpisode =
            this.streamPlaylist[this.streamStatus.currentEpisode].sub.video;
        let subEpisodeDuration =
            this.streamPlaylist[this.streamStatus.currentEpisode].sub
                .episodeLength;

        let currentDubEpisode =
            this.streamPlaylist[this.streamStatus.currentEpisode].dub.video;
        let dubEpisodeDuration =
            this.streamPlaylist[this.streamStatus.currentEpisode].dub
                .episodeLength;
        this.streamStatus.subDuration = subEpisodeDuration;
        this.streamStatus.dubDuration = dubEpisodeDuration;
        this.setCurrentSeriesInfo(currentDubEpisode);
        this.streamStatus.currentSubFiles = currentSubEpisode;
        this.streamStatus.currentDubFiles = currentDubEpisode;
        if (subEpisodeDuration > dubEpisodeDuration) {
            this.streamStatus.episodeDuration = subEpisodeDuration;
        } else if (dubEpisodeDuration > subEpisodeDuration) {
            this.streamStatus.episodeDuration = dubEpisodeDuration;
        } else {
            this.streamStatus.episodeDuration = subEpisodeDuration;
        }
        this.streamStatus.isInitialized = true;
        // try {
        //     let subFiles = await scraper.getMediaSources(currentSubEpisode);
        //     let dubFiles = await scraper.getMediaSources(currentDubEpisode);

        //     if (dubFiles === undefined || dubFiles.length === 0) {
        //         this.streamStatus.currentDubFiles = subFiles;
        //         console.log("----------Failed To Load Dub--------");
        //         this.streamStatus.dubLoadError = true;
        //     } else {
        //         this.streamStatus.currentDubFiles = dubFiles;
        //         this.streamStatus.dubLoadError = false;
        //     }

        //     if (subFiles === undefined || subFiles.length === 0) {
        //         this.streamStatus.currentSubFiles = dubFiles;
        //         console.log("----------Failed To Load Sub--------");
        //         this.streamStatus.subLoadError = true;
        //     } else {
        //         this.streamStatus.currentSubFiles = subFiles;
        //         this.streamStatus.subLoadError = false;
        //     }

        //     if (
        //         this.streamStatus.dubLoadError &&
        //         this.streamStatus.subLoadError
        //     ) {
        //         console.log("dub and sub load error");
        //         await this.episodeDurationInitialize();
        //     }

        //     if (
        //         (subEpisodeDuration > dubEpisodeDuration &&
        //             !this.streamStatus.subLoadError) ||
        //         (subEpisodeDuration < dubEpisodeDuration &&
        //             this.streamStatus.dubLoadError)
        //     ) {
        //         this.streamStatus.isInitialized = true;

        //         return subEpisodeDuration;
        //     } else if (
        //         (dubEpisodeDuration > subEpisodeDuration &&
        //             !this.streamStatus.dubLoadError) ||
        //         (dubEpisodeDuration < subEpisodeDuration &&
        //             this.streamStatus.subLoadError)
        //     ) {
        //         this.streamStatus.isInitialized = true;
        //         return dubEpisodeDuration;
        //     } else if (dubEpisodeDuration === subEpisodeDuration) {
        //         this.streamStatus.isInitialized = true;
        //         return subEpisodeDuration;
        //     }
        // } catch (error) {
        //     console.log("There was an error: " + error);
        // }
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
            this.initializeEpisode();
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
