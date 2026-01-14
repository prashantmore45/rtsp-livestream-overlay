# RTSP Livestream Overlay Web Application

## Project Overview
This is a full-stack web application designed to play RTSP livestreams and manage custom overlays (text and images) in real-time. It demonstrates the integration of a React frontend with a Python (Flask) backend and MongoDB persistence.

**Live Demo Video:** [Link to your video will go here]

## Technology Stack
* **Frontend:** React.js, `react-rnd` (for drag-and-drop), `axios`
* **Backend:** Python (Flask), `flask_pymongo`, `flask_cors`
* **Database:** MongoDB
* **Video:** HTML5 Video (Supports RTSP-to-HTTP streams)

## Features
* **Livestream Playback:** Plays RTSP streams converted to HTTP protocols (HLS/MP4).
* **Custom Overlays:** Create, Read, Update, and Delete (CRUD) overlays.
* **Interactive UI:** Drag-and-drop positioning and resizing of overlays.
* **Real-time State:** Overlay positions are saved to the database immediately.

## Setup Instructions

### Prerequisites
* Node.js & npm
* Python 3.x
* MongoDB (running locally on port 27017)

### 1. Backend Setup
```bash

cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install flask flask-cors flask-pymongo pymongo
python app.py
Server runs on: http://localhost:5000

```

2. Frontend Setup
```Bash

cd frontend
npm install
npm start
App runs on: http://localhost:3000

```
### API Endpoints (CRUD)
* POST /overlays: Create a new overlay.

* GET /overlays: Retrieve all overlays.

* PUT /overlays/<id>: Update overlay position/size.

* DELETE /overlays/<id>: Delete an overlay.

### Usage Guide
1. Stream URL: The player accepts HTTP-compatible video streams.

  - Demo URL: http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
  
  - Note: Standard RTSP streams (rtsp://) must be converted via a service like RTSP.me before use.

2. Add Overlay: Select "Text" or "Image", enter content, and click "Create".

3. Edit: Drag the overlay to move it. Drag the corners to resize it.

4. Remove: Click the red "X" button on the overlay.


## Note on RTSP Streaming: 
The application is designed to accept RTSP streams converted to HTTP (HLS/MP4) via services like RTSP.me. During development, public RTSP services were unstable, so a direct HTTP MP4 stream (BigBuckBunny.mp4) is used for the demo to simulate the converted stream output. The architecture supports any standard HTML5-compatible video source.