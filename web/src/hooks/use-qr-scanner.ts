import { useCallback, useEffect, useRef, useState } from "react";

type UseQrScannerOptions = {
  onDetect: (rawValue: string) => void;
  scanIntervalMs?: number;
};

export function useQrScanner({ onDetect, scanIntervalMs = 300 }: UseQrScannerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastValueRef = useRef<string>("");

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBarcodeDetectorSupported = typeof (window as any).BarcodeDetector !== "undefined";

  const stop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser.");
      return;
    }
    if (!isBarcodeDetectorSupported) {
      setError("QR scanning is not supported here (no BarcodeDetector). Use manual paste/ID.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        setError("Video element not found.");
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      video.srcObject = stream;
      await video.play();

      const Detector = (window as any).BarcodeDetector;
      const detector = new Detector({ formats: ["qr_code"] });

      setIsRunning(true);

      timerRef.current = window.setInterval(async () => {
        try {
          if (!videoRef.current) return;
          const results = await detector.detect(videoRef.current);
          if (!results || results.length === 0) return;

          const raw = results[0]?.rawValue ?? results[0]?.value;
          if (!raw) return;

          // avoid spamming same value
          if (raw === lastValueRef.current) return;
          lastValueRef.current = raw;

          onDetect(raw);
        } catch {
          // ignore per-frame errors
        }
      }, scanIntervalMs) as unknown as number;
    } catch (e: any) {
      if (e?.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access or use manual paste/ID.");
      } else {
        setError("Unable to start camera. Try HTTPS/localhost, or use manual paste/ID.");
      }
      stop();
    }
  }, [isBarcodeDetectorSupported, onDetect, scanIntervalMs, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    videoRef,
    isRunning,
    error,
    isBarcodeDetectorSupported,
    start,
    stop,
  };
}

