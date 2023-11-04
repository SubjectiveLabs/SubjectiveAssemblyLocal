# Subjective Assembly

Open-source platform for schools to make live, synchronised school bell times, student notices and site bookmarks available to Subjective students connected to the school's server either on the web or local network.

Learn more about [Subjective: the **school-driven, student-centric** iOS class and learning organisation app](https://bit.ly/subjectiveapp).

## Usage

1. Clone this repository.
2. Use Cargo and Vite to run Assembly's front-end and back-end servers locally with the script at `scripts/start.sh`, or host the code using your own hardware or service. A Docker image is available for easy deployment.

    ```bash
    $ docker compose up --build
    ... # wait for the build to finish
    [+] Running 1/1
     ✔ Container subjectiveassembly-server-1  Recreated 0.1s
    Attaching to subjectiveassembly-server-1
    subjectiveassembly-server-1  | Rocket has launched from http://0.0.0.0:80
    ```

    The image is [also available on GitHub Packages Container Registry](https://github.com/SubjectiveLabs/SubjectiveAssembly/pkgs/container/subjective-assembly) as `ghcr.io/SubjectiveLabs/subjective-assembly:latest`.

    Run `docker pull ghcr.io/SubjectiveLabs/subjective-assembly:latest` to pull the image.

3. Configure your school's bell times, notices, and links by opening Assembly (if you are accessing it directly on your server, it is most likely localhost/app), otherwise it will be *[server-address]*/app

4. Connect to the server with Subjective by inputting the host link of Assembly. This would be the server's local IP address, or if the server is on the web, its web address.
