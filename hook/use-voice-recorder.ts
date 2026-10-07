"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Formats tried in order; Safari only records MP4/AAC
const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

const EXTENSIONS: Record<string, string> = {
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
};

export type StartRecordingResult = "started" | "denied" | "unsupported";

// Records a voice message from the microphone and returns it as an audio File.
// Recording pauses on its own once `maxSeconds` is reached.
export function useVoiceRecorder({ maxSeconds = 300 } = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);

  const release = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
  }, []);

  const start = useCallback(async (): Promise<StartRecordingResult> => {
    if (recorderRef.current) return "started";

    if (
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      return "unsupported";
    }

    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return "denied";
    }

    const mimeType = MIME_CANDIDATES.find((type) =>
      MediaRecorder.isTypeSupported(type),
    );
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );

    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    streamRef.current = stream;
    recorderRef.current = recorder;
    secondsRef.current = 0;
    setSeconds(0);
    setIsRecording(true);
    recorder.start();

    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);

      if (secondsRef.current >= maxSeconds) {
        // Keep what was recorded and wait for the user to send or cancel
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        if (recorder.state === "recording") recorder.pause();
      }
    }, 1000);

    return "started";
  }, [maxSeconds]);

  // Stops recording and resolves with the audio file (null if nothing was captured)
  const stop = useCallback((): Promise<File | null> => {
    const recorder = recorderRef.current;

    if (!recorder) return Promise.resolve(null);

    return new Promise((resolve) => {
      recorder.onstop = () => {
        // Drop the codec suffix so the type reads as a plain audio MIME type
        const type = (recorder.mimeType || "audio/webm").split(";")[0];
        const blob = new Blob(chunksRef.current, { type });

        release();

        if (blob.size === 0) return resolve(null);

        resolve(
          new File(
            [blob],
            `voice-message-${Date.now()}.${EXTENSIONS[type] ?? "webm"}`,
            { type },
          ),
        );
      };

      recorder.stop();
    });
  }, [release]);

  // Stops recording and discards the audio
  const cancel = useCallback(() => {
    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }

    release();
  }, [release]);

  // Never leave the microphone on after the composer unmounts
  useEffect(() => cancel, [cancel]);

  return { isRecording, seconds, maxSeconds, start, stop, cancel };
}
