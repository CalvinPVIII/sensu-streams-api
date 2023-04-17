import EpisodeHelper from "./EpisodeHelper.ts";
import { episode, file } from "./Types.ts";
import playlists from "./episodes/Playlists.ts";

export default class Stream {
  isActive: boolean;

  currentSubFiles: Array<file>;
  currentDubFiles: Array<file>;
  currentEpisode: number;
  currentTime: number;
  episodeInfo: string;
  isEpisodeInitialized: boolean;
  episodeDuration: number;
  dubDuration: number;
  subDuration: number;
  failedToLoadVideo: boolean;
  dubLoadError: boolean;
  subLoadError: boolean;
  streamPlaylist: Array<episode>;

  constructor() {
    this.isActive = false;
    this.currentSubFiles = [];
    this.currentDubFiles = [];
    this.currentEpisode = 0;
    this.currentTime = 0;
    this.episodeInfo = "";
    this.isEpisodeInitialized = false;
    this.episodeDuration = 0;
    this.dubDuration = 0;
    this.subDuration = 0;
    this.failedToLoadVideo = false;
    this.dubLoadError = false;
    this.subLoadError = false;
    this.streamPlaylist = playlists.test;
  }

  //   this should be the method responsible for updating the current info of the stream when a new episode starts. It should set the episodeDuration based on the sub/dub length, call the method(s) from EpisodeHelper to get the video sources for the current episode, return the duration of the episode, based on what is longer, sub or dub.

  async initializeEpisode(): Promise<number> {
    const promise = new Promise<number>(async (resolve, reject) => {
      console.log("Initializing episode");
      this.isEpisodeInitialized = false;
      // let currentSubSources = this.streamPlaylist[this.currentEpisode].sub.sources;
      let subEpisodeDuration = this.streamPlaylist[this.currentEpisode].sub.episodeLength;

      // let currentDubSources = this.streamPlaylist[this.currentEpisode].dub.sources;
      let dubEpisodeDuration = this.streamPlaylist[this.currentEpisode].dub.episodeLength;
      this.subDuration = subEpisodeDuration;
      this.dubDuration = dubEpisodeDuration;
      this.episodeInfo = this.streamPlaylist[this.currentEpisode].episodeInfo;

      // this gets and organizes the files for each source
      // investigate why this isn't waiting
      const episodeFiles: any = await EpisodeHelper.getEpisodeFiles(this.streamPlaylist[this.currentEpisode]);

      this.currentDubFiles = episodeFiles.dub;
      this.currentSubFiles = episodeFiles.sub;

      // this sets the episode duration
      if (subEpisodeDuration >= dubEpisodeDuration) {
        this.isEpisodeInitialized = true;
        resolve(subEpisodeDuration);
      } else {
        this.isEpisodeInitialized = true;
        resolve(dubEpisodeDuration);
      }
    });
    return promise;
  }

  startStream(): string {
    console.log("Starting video stream");
    this.currentTime = 0;
    this.isActive = true;
    this.isEpisodeInitialized = false;
    this.handleVideoStream();
    return "Starting video stream";
  }

  stopStream(): string {
    console.log("Stopping stream");

    this.isActive = false;
    return "Stream Stopped";
  }

  handleMoveToNextEpisode() {
    // reset the current time and move onto the next episode
    this.currentTime = 0;
    this.currentEpisode++;
    this.isEpisodeInitialized = false;
    // if the next episode is outside of the array

    if (this.currentEpisode == this.streamPlaylist.length) {
      // reset the episodes to start at the beginning
      this.currentEpisode = 0;
    }
  }

  async handleVideoStream() {
    // if the stream is active
    if (this.isActive) {
      // this gets the episode duration if it hasn't already been initialized

      if (!this.isEpisodeInitialized) {
        console.log("Handle video stream: streamStatus is not initialized");
        this.episodeDuration = await this.initializeEpisode();
        console.log(this.currentDubFiles);
      }
      console.log(`episode duration ${this.episodeDuration}`);
      console.log(`episode number ${this.currentEpisode}`);

      // this section is responsible for setting the max duration and updating the info in the class every second

      // increase the current time every second
      this.currentTime++;
      console.log(this.currentTime);
      // if the current time is greater than or equal the max episode of the duration
      if (this.currentTime >= this.episodeDuration) {
        this.handleMoveToNextEpisode();
        console.log(`current episode is ${this.currentEpisode}`);
      }
      // call the function again to start the timer over
      this.progressStream();
    }
  }

  progressStream() {
    setTimeout(() => {
      this.handleVideoStream();
    }, 1000);
  }
}
