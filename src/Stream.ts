import EpisodeHelper from "./EpisodeHelper";

export default class Stream {
  isActive: boolean;
  currentSubFiles: string;
  currentDubFiles: string;
  currentEpisode: number;
  currentTime: number;
  episodeInfo: string;
  isInitialized: boolean;
  episodeDuration: number;
  dubDuration: number;
  subDuration: number;
  failedToLoadVideo: boolean;
  dubLoadError: boolean;
  subLoadError: boolean;
  //   streamPlaylist: Array<episode>;

  constructor() {
    // this.streamPlaylist = streamPlaylists.mainWithSuperMovies;
    // this.currentNonWorkingSources = ["KimAnime", "Gogoanime"];

    this.isActive = true;
    this.currentSubFiles = "";
    this.currentDubFiles = "";
    this.currentEpisode = 0;
    this.currentTime = 0;
    this.episodeInfo = "";
    this.isInitialized = false;
    this.episodeDuration = 0;
    this.dubDuration = 0;
    this.subDuration = 0;
    this.failedToLoadVideo = false;
    this.dubLoadError = false;
    this.subLoadError = false;
    // this.streamPlaylist = null;
  }

  startStream(): string {
    console.log("Starting video stream");
    this.currentTime = 0;
    this.isActive = true;
    this.isInitialized = false;
    // this.handleVideoStream();
    return "Starting video stream";
  }

  stopStream(): string {
    console.log("Stopping stream");

    this.isActive = false;
    return "Stream Stopped";
  }
}
