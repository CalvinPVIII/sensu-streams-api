// import dragonBall from "./episodes/DragonBall.ts";
// import dragonBallZ from "./episodes/DragonBallZ.ts";
import dragonBallKai from "./episodes/DragonBallKai.ts";
import dragonBallSuper from "./episodes/DragonBallSuper.ts";
// import dragonBallGt from "./episodes/DragonBallGt.ts";

import { series } from "./Types";

export default class EpisodeHelper {
  static series: { [key: string]: series } = {
    // dragonBall: dragonBall,
    // dragonBallZ: dragonBallZ,
    dragonBallKai: dragonBallKai,
    dragonBallSuper: dragonBallSuper,
    // dragonBallGt: dragonBallGt;
  };
  //   static dragonBall: series = dragonBall;
  //   static dragonBallZ: series = dragonBallZ;
  static dragonBallKai: series = dragonBallKai;
  static dragonBallSuper: series = dragonBallSuper;
  //   static dragonBallGt: series = dragonBallGt;
  static nonWorkingSources: Array<string> = ["KimAnime", "Gogoanime"];

  static updateNonWorkingSources(sourceName: string): string {
    if (this.nonWorkingSources.includes(sourceName)) {
      const index = this.nonWorkingSources.indexOf(sourceName);
      this.nonWorkingSources.splice(index, 1);
      return "removed";
    } else {
      this.nonWorkingSources.push(sourceName);
      return "added";
    }
  }
}
