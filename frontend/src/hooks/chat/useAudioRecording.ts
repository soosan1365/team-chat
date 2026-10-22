import { useState } from "react";
export function useAudioRecording(
  onRecordingComplete: (blob: Blob) => Promise<unknown>,
) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());
        setMediaRecorder(null);
        setIsRecording(false);

        try {
          await onRecordingComplete(blob);
        } catch (error) {
          console.error("Failed to send audio:", error);
          alert("Failed to send audio message.");
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access failed:", error);
      alert("Please allow microphone access to record audio.");
    }
  }
  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }
  return {
    startRecording,
    stopRecording,
    isRecording,
    mediaRecorder,
  };
}
