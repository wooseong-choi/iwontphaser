import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import React, { useEffect, useRef } from "react";

interface VideoComponentProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantId: string;
  local?: boolean;
}

function VideoComponent({ track, participantId, local }: VideoComponentProps) {
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoElement.current) {
      track.attach(videoElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <div id={"camera-" + participantId} className="video-container">
      <div className="participant-data">
        <p>{participantId + (local ? " (You)" : "")}</p>
      </div>
      <video ref={videoElement} id={track.sid}></video>
    </div>
  );
}

export default VideoComponent;
