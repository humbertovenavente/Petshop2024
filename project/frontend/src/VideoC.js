import React from 'react';

function VideoComponent({ videoUrl }) {
  return (
    <div className="video-container" style={{ width: '50%', margin: '0 auto' }}>  {/* Ajuste de tamaño */}
      <video width="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Tu navegador no soporta este video.
      </video>
    </div>
  );
}

export default VideoComponent;
