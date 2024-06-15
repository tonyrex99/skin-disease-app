// src/components/ImageUploader.js
import React, { useState } from "react";
import axios from "axios";
import ImageEditor from "./ImageEditor";

const ImageUploader = ({ setPredictions }) => {
  const [images, setImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleImageEdit = (file, editedFile) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.file === file
          ? { file: editedFile, preview: URL.createObjectURL(editedFile) }
          : img
      )
    );
    setEditingImage(null);
  };

  const handleImageRemove = (file) => {
    setImages((prevImages) => prevImages.filter((img) => img.file !== file));
  };

  const handleImageClick = (image) => {
    setEditingImage(image);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image.file));

    console.log("images are:  ", images);
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPredictions(response.data.predictions);
      setImages(images);
      //   setPredictions(result.predictions); // Pass the predictions to the state
      console.log("api response is: ", response);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageChange} />
      <div
        className="image-preview-container"
        style={{ backgroundColor: "red" }}
      >
        {images.map((image) => (
          <>
            <div key={image.file.name} className="image-preview">
              <img
                src={image.preview}
                alt={image.file.name}
                onClick={() => handleImageClick(image)}
              />
              <button onClick={() => handleImageRemove(image.file)}>X</button>
            </div>
            image
            <ImageEditor
              file={image.preview}
              onSave={handleImageEdit}
              onClose={() => setEditingImage(null)}
            />
            <button onClick={handleFileUpload}>Submit</button>
          </>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
