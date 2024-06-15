// src/components/PredictionPage.js
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PredictionPage = ({ images, predictions }) => {
  const handleDownloadReport = () => {
    const input = document.getElementById("report-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("report.pdf");
    });
  };

  return (
    <div id="report-content">
      <h2>Predictions</h2>
      <div className="predictions">
        {images.map((image, index) => (
          <div key={index} className="prediction">
            <img
              src={image.preview}
              alt="preview"
              style={{ width: "100px", height: "100px" }}
            />
            <p>{predictions[index]}</p>
          </div>
        ))}
      </div>
      <button onClick={handleDownloadReport}>Download Report</button>
    </div>
  );
};

export default PredictionPage;
