import { useState } from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { Button, message, Modal } from "antd";
import axios from "axios";
import "./upload.css";

const AntUpload = ({ activeView, setactiveView }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [lastPediction, setlastPediction] = useState([]);
  //const [lastServerResponse, setlastServerResponse] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const combineData = (fileList, serverPredictions) => {
    const predictionMap = serverPredictions.reduce((map, pred) => {
      map[pred.image_name] = pred.predictions;
      return map;
    }, {});

    return fileList.map((file) => ({
      imageName: file.name,
      imgSrc: file.thumbUrl,
      predictions: predictionMap[file.name] || [],
    }));
  };
  const retakePrediction = () => {
    setFileList([]);
    setactiveView("home");
    setisModalOpen(false);
  };
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      console.log("each file is: ", file);

      formData.append("images", file.originFileObj); // Use originFileObj
    });
    console.log("formdata to upload is: ", formData);

    setUploading(true);
    // You can use any AJAX library you like
    try {
      console.log("formdata in try to upload is: ", formData);

      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const combinedData = combineData(fileList, response.data.predictions);

      console.log("combine image name and prediction data is: ", combinedData);
      console.log("file list is: ", fileList);
      console.log(" server response is: ", response);
      setlastPediction(combinedData);
      //setlastServerResponse(response);
      setFileList([]);
      setisModalOpen(true);
      message.success("upload successfully.");

      console.log("api response is: ", response);
    } catch (error) {
      //  Alert.Alert(error.message);
      console.error("Error uploading images:", error.message);
      message.error(`Error uploading images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const viewPredictionResult = () => {
    setactiveView("predict");
    setisModalOpen(false);
  };

  return (
    <div className="flex justify-center flex-col">
      {activeView == "home" ? (
        <>
          <ImgCrop rotationSlider>
            <Upload
              className={`relative ${
                fileList.length > 0 && "flex-row"
              } ant-upload ant-upload-select px-5 md:px-12 py-7 mt-10 bg-skinGreen/10 rounded-2xl border-4 ${
                fileList.length < 1 && "justify-center"
              } w-full min-h-80  flex h-auto grow max-h-[412px] border-dotted`}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              progress={{
                strokeColor: {
                  "0%": "#108ee9",
                  "100%": "#87d068",
                },
                strokeWidth: 3,
                format: (percent) =>
                  percent && `${parseFloat(percent.toFixed(2))}%`,
              }}
              beforeUpload={(file) => {
                setFileList([...fileList, file]);
                return false;
              }}
            >
              <div className="flex  absolute left-0 top-0 min-w-10 w-full h-full">
                {fileList.length < 1 && (
                  <div className=" gap-y-1  md:gap-y-4  flex-col items-center justify-center  self-center w-full flex h-full text-xl md:text-2xl  border-dotted">
                    <img src="folder.svg" />

                    <div className=" text-blueText text-center  font-semibold ">
                      Drag your documents or photos here to upload
                    </div>
                    <div className="text-ash-500">Or</div>
                    <button className=" py-3 px-5 rounded-2xl bg-skinGreen text-blueText font-semibold ">
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </Upload>
          </ImgCrop>
          <Button
            className="bg-skinGreen self-center w-full p-8 flex items-center justify-center max-w-60"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{
              marginTop: 25,
            }}
          >
            <div className=" py-6 px-8 rounded-2xl text-xl  text-blueText font-semibold ">
              {uploading ? "Submitting" : "Submit"}
            </div>
          </Button>
        </>
      ) : (
        <PredictionPage
          fileList={lastPediction}
          backFn={() => {
            setactiveView("home");
          }}
        />
      )}

      <Modal
        onCancel={retakePrediction}
        centered={true}
        open={isModalOpen}
        onClose={retakePrediction}
        footer={(_, { OkBtn, CancelBtn }) => <></>}
      >
        <div className="w-full h-full flex justify-center flex-col p-10  gap-4">
          <div className=" underline text-3xl text-center text-blueText font-bold mb-7  ">
            Your results are ready!!
          </div>

          <div className="text-blueText text-center font-normal text-xl">
            {lastPediction.length} document(s) were analysed
          </div>

          <div className="flex w-full gap-x-4 justify-center mt-6 ">
            <button
              onMouseDown={viewPredictionResult}
              className=" py-3 px-5 rounded-xl bg-skinGreen hover:bg-skinGreen/30 text-white font-semibold "
            >
              View Prediction Result
            </button>

            <button
              onMouseDown={retakePrediction}
              className=" py-3 px-5 rounded-xl border-skinGreen border hover:bg-skinGreen/10  text-blueText   font-semibold "
            >
              Retake Prediction
            </button>
          </div>
        </div>
      </Modal>

      <div></div>
    </div>
  );
};
const PredictionPage = ({ fileList, backFn }) => {
  return (
    <div className="flex w-full h-screen flex-col relative p-2 md:p-8 mt-7 ">
      <button
        onMouseDown={() => {
          backFn();
        }}
        className="text-blueText absolute top-0 left-3 font-bold text-xl bg-skinGreen p-2 rounded-xl items-center "
      >
        &lt; Back
      </button>
      <div className="mt-12 w-full"></div>
      <div className="font-bold  text-skinGreen text-center  text-3xl underline lg:text-3xl">
        YOUR RESULTS
      </div>
      <div className="flex w-full h-full flex-row flex-wrap justify-center  gap-8">
        {fileList.map((file, index) => (
          <div key={index}>
            <div
              key={index}
              className="flex flex-row  px-2 justify-center text-2xl gap-x-8 gap-y-6"
            >
              <img src={file.imgSrc} width={400} className=" min-w-32 " />
              <div
                className="mt-5 text-left flex  flex-col gap-y-1 md:gap-y-5 justify-center items-center py-7"
                key={index}
              >
                {file.predictions.slice(0, 3).map((prediction) => (
                  <div
                    className="text-left flex h-fit w-full flex-row "
                    key={prediction.label}
                  >
                    <div className="w-fit text-nowrap text-left font-bold">
                      {" "}
                      {prediction.label}:{" "}
                    </div>
                    <div className="w-fit font-semibold">
                      &nbsp;
                      {(prediction.accuracy.toFixed(2) * 100).toFixed(2) + "%"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AntUpload;
