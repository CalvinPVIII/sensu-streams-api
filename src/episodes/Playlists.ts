import dragonBall from "./DragonBall.ts";
import dragonBallGt from "./DragonBallGt.ts";
import dragonBallKai from "./DragonBallKai.ts";
import dragonBallSuper from "./DragonBallSuper.ts";
import dragonBallZ from "./DragonBallZ.ts";

const playlists = {
  main: [...Object.values(dragonBallKai), ...Object.values(dragonBallSuper), ...Object.values(dragonBall)],
  test: [Object.values(dragonBallZ)[0], Object.values(dragonBallGt)[0]],
};

export default playlists;
