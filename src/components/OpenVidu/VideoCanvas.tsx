import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import React, { useEffect, useRef, useState } from "react";
import "./VideoComponent.css";
import AudioComponent from "./AudioComponent";
import VideoComponent from "./VideoComponent.tsx";

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participant: string;
};

let APPLICATION_SERVER_URL = ""; // The URL of your application server
let LIVEKIT_URL = ""; // The URL of your LiveKit server
configureUrls();

function configureUrls() {
  // If APPLICATION_SERVER_URL is not configured, use default value from local development
  if (!APPLICATION_SERVER_URL) {
    if (window.location.hostname === "localhost") {
      APPLICATION_SERVER_URL = "http://localhost:6080/";
    } else {
      APPLICATION_SERVER_URL = "https://" + window.location.hostname + ":6443/";
    }
  }

  // If LIVEKIT_URL is not configured, use default value from local development
  if (!LIVEKIT_URL) {
    if (window.location.hostname === "localhost") {
      LIVEKIT_URL = "ws://localhost:7880/";
    } else {
      LIVEKIT_URL = "wss://" + window.location.hostname + ":7443/";
    }
  }
}

function VideoCanvas() {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined
  );

  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  // 참가자 이름 -> props로 받아오기
  const [participantName, setParticipantName] =
    useState<string>("LocalParticipant");
  const [roomName, setRoomName] = useState<string>("LocalRoom");

  useEffect(() => {
    joinRoom();

    return () => {
      leaveRoom();
    };
  }, []);

  async function joinRoom() {
    const room = new Room();
    setRoom(room);

    room.on(
      RoomEvent.TrackSubscribed,
      (
        _track: RemoteTrack,
        publication: RemoteTrackPublication,
        participant: RemoteParticipant
      ) => {
        setRemoteTracks((prev) => [
          ...prev,
          {
            trackPublication: publication,
            participant: participant.identity,
          },
        ]);
      }
    );

    room.on(
      RoomEvent.TrackUnsubscribed,
      (_track: RemoteTrack, publication: RemoteTrackPublication) => {
        setRemoteTracks((prev) =>
          prev.filter(
            (track) => track.trackPublication.trackSid !== publication.trackSid
          )
        );
      }
    );

    try {
      const token = await getToken(roomName, participantName);
      await room.connect(LIVEKIT_URL, token);

      await room.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(
        room.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );
    } catch (error) {
      console.log(
        "There was an error connecting to the room: ",
        (error as Error).message
      );
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    // Leave the room by calling 'disconnect' method over the Room object
    await room?.disconnect();

    // Reset the state
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  }

  async function getToken(roomName: string, participantName: string) {
    const response = await fetch(APPLICATION_SERVER_URL + "token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomName: roomName,
        participantName: participantName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get token: ${error.errorMessage}`);
    }

    const data = await response.json();
    return data.token;
  }

  return (
    <>
      <div id="room">
        <div id="room-header">
          {localTrack && (
            <VideoComponent
              track={localTrack}
              participantId={participantName}
              local={true}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default VideoCanvas;
