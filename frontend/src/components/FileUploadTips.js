import React from 'react';

const FileUploadTips = () => {
  return (
    <div className="upload-tips">
      <h4>📁 Upload Tips for Faster Processing:</h4>
      <ul>
        <li>🎬 <strong>Video Format:</strong> MP4 files upload fastest</li>
        <li>📏 <strong>File Size:</strong> Keep videos under 2GB for best performance</li>
        <li>🖼️ <strong>Poster Images:</strong> Use JPG/PNG under 5MB</li>
        <li>⚡ <strong>Internet:</strong> Stable connection recommended</li>
        <li>⏱️ <strong>Processing Time:</strong> Large files may take 5-10 minutes</li>
        <li>🔄 <strong>Don't Refresh:</strong> Keep page open during upload</li>
      </ul>
    </div>
  );
};

export default FileUploadTips;