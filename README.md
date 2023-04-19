# Senzu Streams

Senzu Streams is a streaming website dedicated to providing on-demand video for all the Dragon Ball series. With a vast library of content, users can enjoy the entire Dragon Ball universe at their convenience. Additionally, Senzu Streams offers a 24/7 feed of the entire Dragon Ball series, allowing users to binge-watch their favorite show whenever they want. The website also features an integrated Twitch chat, which enables users to interact with each other while watching their favorite shows. With a user-friendly interface and a vast collection of Dragon Ball content, Senzu Streams is the ultimate destination for Dragon Ball fans.

**_Senzu Streams is currently under beta_**

## Disclaimer:

Senzu Streams is a non-profit fan project. We do not host the videos ourselves, nor do we host ads or otherwise earn any revenue from the content being displayed. All videos come from third party sources. Please contact the appropriate video host for removal. Dragon Ball, Dragon Ball Z, Dragon Ball GT, and Dragon Ball Super are all owned by Funimation, Toei Animation, Shueisha, and Akira Toriyama.

### Endpoints:

| Endpoint                         | Response                             |
| -------------------------------- | ------------------------------------ |
| /episodes                        | All episodes from every series       |
| /episodes/:series                | All episodes from given series       |
| /episodes/:series/:episodeNumber | Streaming links for given episode    |
| /movies                          | All movies from every series         |
| /movies/:series                  | All movies from given series         |
| /movies/:series/:movieNumber     | Streaming links for given movie      |
| /stream                          | Information about the current stream |

**Supported series parameters: DragonBall, DragonBallZ, DragonBallKai, DragonBallSuper, and DragonBallGT**
