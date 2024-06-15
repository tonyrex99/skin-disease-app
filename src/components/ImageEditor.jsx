// src/components/ImageEditor.js
import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageEditor = ({ file, onSave, onClose }) => {
  const [crop, setCrop] = useState({ aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [finalcut, setFinalcut] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleImageLoaded = (image) => {
    imgRef.current = image;
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleSave = async () => {
    if (completedCrop?.width && completedCrop?.height) {
      const croppedImageUrl = await getCroppedImg(file, completedCrop);
      const croppedFile = await urlToFile(
        croppedImageUrl,
        file.name,
        file.type
      );
      setFinalcut(croppedFile);
      onSave(file, croppedFile);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          // Handle error here
          console.error("Canvas is empty");
          return;
        }
        blob.name = file.name;
        const croppedImageUrl = window.URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, "image/jpeg");
    });
  };

  const urlToFile = (url, filename, mimeType) => {
    return fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], filename, { type: mimeType }));
  };

  return (
    <div className="image-editor" style={{ backgroundColor: "blue" }}>
      image editor
      <ReactCrop
        src={file}
        crop={crop}
        onImageLoaded={handleImageLoaded}
        onComplete={handleCropComplete}
        onChange={(newCrop) => setCrop(newCrop)}
      >
        <img src={file} />
      </ReactCrop>
      <div>
        cropped image is
        <img src={finalcut} />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageEditor;
