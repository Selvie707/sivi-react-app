import './Learn.css';
import axios from "axios";
import Guide from "../guide/Guide";
import logo from "../../assets/offcam-logo.png";
import Navbar from '../../components/navbar/Navbar';
import React, { useEffect, useRef, useState } from "react";
import API from "../../api";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Learn = () => {
  const fetchInterval = 800;
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [detectedLetter, setDetectedLetter] = useState("-");
  const [targetLetter, setTargetLetter] = useState(alphabet[Math.floor(Math.random() * alphabet.length)]);

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
          
          const isCorrect = detectedClass === targetLetter;
  
          if (isCorrect) {
            setHistory((prevHistory) => [
              ...prevHistory,
              { frame: `data:image/jpeg;base64,${frame}`, letter: detectedClass }
            ]);
            
            setTargetLetter(alphabet[Math.floor(Math.random() * alphabet.length)]);
          }
        }
      } else {
        setDetectedLetter("-");
      }
    } catch (err) {
      console.error("Error sending frame to server: ", err);
    }
  };
  

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);
    if (cameraActive) {
      const newIntervalId = setInterval(sendFrameToServer, fetchInterval);
      setIntervalId(newIntervalId);
      return () => clearInterval(newIntervalId);
    }
  }, [fetchInterval, cameraActive, targetLetter]);

  return (
    <div className='container'>
      <Navbar />

      <div className="main-container">
        {!cameraActive ? (
          <img src={logo} alt="Logo" className="cam-logo" style={{ width: "30%"}} />          
        ) : (
          <video className="video" ref={videoRef} autoPlay playsInline />
        )}

        <div className="target-detected-letter">
            <div className="letters">
                <div className="letter">
                    <h2 className="title">PERAGAKAN HURUF</h2>
                    <p className="result">{targetLetter}</p>
                </div>
                
                <div className="letter">
                    <h2 className="title">TERDETEKSI SEBAGAI</h2>
                    <p className="result">{detectedLetter}</p>
                </div>
            </div>

            <div className="camera-selection">
              <label htmlFor="cameraSelect">PILIH KAMERA:</label>

              <select
                id="cameraSelect"
                className="camera-options"
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

              {!cameraActive ? (
                <button className="camera-button" onClick={startCamera}>MULAI KAMERA</button>
              ) : (
                <button className="camera-button" onClick={stopCamera}>MATIKAN KAMERA</button>
              )}
            </div>
            
            <button className="guide-button" onClick={() => setShowGuide(true)}>PANDUAN</button>
            {showGuide && <Guide onClose={() => setShowGuide(false)} />}
        </div>
      </div>

      <div className="history-container">
        <div className="history">
          <h2 className="history-text">JAWABAN BENAR</h2>
        </div>
        
        <div className="history-grid">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <img src={item.frame} alt={`Detected ${item.letter}`} className="history-image" />
              <p className="historyText">{item.letter}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
