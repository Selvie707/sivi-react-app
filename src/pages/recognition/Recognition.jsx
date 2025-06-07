import styles from './Recognition.module.css';
import Guide from "../guide/Guide";
import logo from "../../assets/offcam-logo.png";
import Navbar from '../../components/navbar/Navbar';
import React, { useEffect, useRef, useState } from "react";
import API from "../../api";

const App = () => {
  const fetchInterval = 800;
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedLetter, setDetectedLetter] = useState("-");
  const [intervalId, setIntervalId] = useState(null);
  const [history, setHistory] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  const checkCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: "camera" });
      if (permission.state === "denied") {
        alert("Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Gagal mengecek izin kamera:", error);
      return false;
    }
  };

  const startCamera = async () => {
    if (!selectedCamera) return;
    
    const permissionGranted = await checkCameraPermission();
    if (!permissionGranted) return;

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
    const startCaptureTime = performance.now();
    const frame = captureFrame();
    if (!frame) return;

    const startSendTime = performance.now(); // Timestamp sebelum mengirim ke backend
    console.log(`Capture Time: ${(startSendTime - startCaptureTime).toFixed(2)} ms`);

    try {
      const response = await API.post("/process_frame", { frame });

      const endResponseTime = performance.now(); // Timestamp setelah menerima respons dari backend
      console.log(`Server Response Time: ${(endResponseTime - startSendTime).toFixed(2)} ms`);

      const detectionResults = response.data.detections;

      if (detectionResults && detectionResults.length > 0) {
        const detectedClass = detectionResults[0].class;
        const detectedConfidence = detectionResults[0].confidence;
        const onnxTime = endResponseTime.toFixed(2); // dalam ms

        if (detectedConfidence > 0.5) {
          setDetectedLetter(detectedClass);
          setHistory((prevHistory) => [
            ...prevHistory,
            {
              frame: `data:image/jpeg;base64,${frame}`,
              letter: detectedClass,
              onnxTime: onnxTime
            }
          ]);
        }
      } else {
        setDetectedLetter("-");
      }
    } catch (err) {
      console.error("Error sending frame to server: ", err);
    }

    const endProcessTime = performance.now(); // Timestamp setelah frontend selesai memproses hasil
    console.log(`Frontend Processing Time: ${(endProcessTime - startSendTime).toFixed(2)} ms`);
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
    <div className={styles["container"]}>
      <Navbar />

      <div className={styles["detected-container"]}>
        {!cameraActive ? (
          <img src={logo} alt="Logo" style={{ width: "30%"}} className={styles["cam-logo"]} />          
        ) : (
          <video className={styles["realtime-video"]} ref={videoRef} autoPlay playsInline />
        )}

        <div className={styles["functions-container"]}>
          <h2 className={styles["title"]}>TERDETEKSI SEBAGAI HURUF</h2>
          <p className={styles["result"]}>{detectedLetter}</p>
          
          <div className={styles["camera-selection"]}>
            <label htmlFor="cameraSelect" className={styles["option-label"]}>PILIH KAMERA:</label>

            <select
              id="cameraSelect"
              className={styles["camera-selectionn"]}
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
          </div>

          {!cameraActive ? (
            <button className={styles["button"]} onClick={startCamera}>MULAI KAMERA</button>
          ) : (
            <button className={styles["button"]} onClick={stopCamera}>MATIKAN KAMERA</button>
          )}

          <button className={styles["button"]} onClick={() => setShowGuide(true)}>PANDUAN</button>
          {showGuide && <Guide onClose={() => setShowGuide(false)} />}
        </div>
      </div>

      <hr className={styles["horizontal-line"]}/>

      <div className={styles["history-container"]}>
        <h2 className={styles["history-text"]}>HASIL DETEKSI</h2>
        
        <div className={styles["history-grid"]}>
          {history.map((item, index) => (
            <div key={index} className={styles["history-item"]}>
              <img src={item.frame} alt={`Detected ${item.letter}`} className={styles["history-image"]} />
              <p className={styles["history-result-text"]}>
                {item.letter}
              </p>
              <p className={styles["history-result-time"]}>
                {item.onnxTime ? `⏱️ ${item.onnxTime} ms` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
