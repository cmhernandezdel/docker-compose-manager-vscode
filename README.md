# Docker Compose manager extension
This extension aims to reduce context switches between your text editor (Visual Studio Code) and the terminal while rebuilding microservices. The Docker extension, while complete, doesn't allow rebuilding an image and restarting the service so, if you are working with microservices, you'll find yourself doing the following quite often:

```
docker compose stop myservice
docker compose build myservice [--no-cache]
docker compose up -d
```

This, at least for me, is very tiring and inconvenient, and that's why I created this extension. Now you can manage this command, among others, directly from the side bar of your text editor.

## Licensing
The software uses a MIT license, which means that it is free for use, distribution and modification even for commercial use. You can read more in the license file of this repository.

## Credits
* Stop icon: [SumberRejeki](https://www.flaticon.com/free-icons/stop-button) via Flaticon.
* Restart icon: [Rizki Ahmad Fauzi](https://www.flaticon.com/free-icons/restart) via Flaticon.
* Compile icon: [kawalanicon](https://www.flaticon.com/free-icons/compile) via Flaticon.
* Activity bar icon: [game-icons.net](https://www.svgrepo.com/svg/323639/whale-tail) via SVGRepo.