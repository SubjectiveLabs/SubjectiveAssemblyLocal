# Subjective Assembly
Create, manage and host student timetables and school bell times for Subjective: the **school-driven, student-centric** iOS class and learning organisation app.
Use this repository to self-host Assembly with the source code.

## Usage
1. Clone this repository.
2. Use Cargo and Vite to run Assembly's front-end and back-end servers locally, or host the code using your own hardware or service. (Docker image coming soon.)
    ``` 
    $ cd ./frontend
    $ npm i
    $ npm run build
    $ cd ../backend
    $ cargo run
    ```
    A `.sh` script should probably be used to do this. (tracked in #3)
3. Connect to the server with Subjective.
    If your school is public on Subjective Discovery, changes to your school'll be reflected to all students of your school on the next cache clear.
    If not, Assembly's share link can be input in Subjective to retrieve your school's bell time data.
