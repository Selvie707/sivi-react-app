import axios from "axios";
import './Recognition.css';
import Guide from "../guide/Guide";
import logo from "../../assets/offcam-logo.png";
import Navbar from '../../components/navbar/Navbar';
import React, { useEffect, useRef, useState } from "react";
import API from "../../api";

const App = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedLetter, setDetectedLetter] = useState("-");
  const [fetchInterval, setFetchInterval] = useState(1000);
  const [intervalId, setIntervalId] = useState(null);
  const [history, setHistory] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  const startCamera = async () => {
    if (!selectedCamera) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedCamera } },
      });

      streamRef.current = stream;
      setCameraActive(true); 
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureFrame = () => {
    if (!cameraActive || !videoRef.current) return null;

    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg").split(",")[1];
  };

  const sendFrameToServer = async () => {
    const frame = captureFrame();
    if (!frame) return;

    try {
      const response = await API.post("/process_frame", { frame });

      if (response.data && response.data.length > 0) {
        const detectedClass = response.data[0].class;
        const detectedConfidence = response.data[0].confidence;

        if (detectedConfidence > 0.5) {
          setDetectedLetter(detectedClass);
          setHistory((prevHistory) => [
            ...prevHistory,
            { frame: `data:image/jpeg;base64,${frame}`, letter: detectedClass }
          ]);
        }
      } else {
        setDetectedLetter("-");
      }
    } catch (err) {
      console.error("Error sending frame to server: ", err);
    }
  };

  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error fetching cameras: ", err);
      }
    }

    getCameras();
  }, []);

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);

    if (cameraActive) {
      const newIntervalId = setInterval(sendFrameToServer, fetchInterval);
      setIntervalId(newIntervalId);
      return () => clearInterval(newIntervalId);
    }
  }, [fetchInterval, cameraActive]);

  return (
    <div className='container'>
      <Navbar />

      <div className="detected-container">
        {!cameraActive ? (
          <img src={logo} alt="Logo" style={{ width: "30%"}} className="cam-logo" />          
        ) : (
          <video className="realtime-video" ref={videoRef} autoPlay playsInline />
        )}

        <div className="functions-container">
          <h2 className="title">TERDETEKSI SEBAGAI HURUF</h2>
          <p className="result">{detectedLetter}</p>
          
          <div className="camera-selection">
            <label htmlFor="cameraSelect" className="option-label">PILIH KAMERA:</label>

            <select
              id="cameraSelect"
              className="camera-selectionn"
              onChange={(e) => setSelectedCamera(e.target.value)}
              value={selectedCamera}
              disabled={cameraActive}
            >
              {cameras.map((camera, index) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Kamera ${index + 1}`}
                </option>
              ))}
            </select>

            <label className="option-label">ATUR KECEPATAN:</label>
            
            <select className="camera-selectionn" onChange={(e) => setFetchInterval(Number(e.target.value))} value={fetchInterval}>
              <option value={500}>0.5 detik</option>
              <option value={1000}>1 detik</option>
              <option value={1500}>1.5 detik</option>
              <option value={2000}>2 detik</option>
              <option value={3000}>3 detik</option>
              <option value={5000}>5 detik</option>
            </select>
          </div>

          {!cameraActive ? (
            <button className="button" onClick={startCamera}>MULAI KAMERA</button>
          ) : (
            <button className="button" onClick={stopCamera}>MATIKAN KAMERA</button>
          )}

          <button className="button" onClick={() => setShowGuide(true)}>PANDUAN</button>
          {showGuide && <Guide onClose={() => setShowGuide(false)} />}
        </div>
      </div>

      <div className="history-container">
        <h2 className="history-text">HASIL DETEKSI</h2>
        
        <div className="history-grid">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <img src={item.frame} alt={`Detected ${item.letter}`} className="history-image" />
              <p className="history-result-text">{item.letter}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
