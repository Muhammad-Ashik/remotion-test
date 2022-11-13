import React from 'react';
import { Video } from 'remotion';

function VideoComponent() {
  return (
    <>
      <Video
        src={"https://fc-revenue-use1-dev-insertion-automation-tool-public.s3.amazonaws.com/3GM+Lakeside+071922+PTSD+Track.mp4"}
        startFrom={0}
        disableRemotePlayback
      />
    </>
  );
}

export default VideoComponent;
