import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import PredictionPage from "./components/PredictionPage";
import Antupload from "./antdupload";

function App() {
  const [tab, setTab] = useState("home");
  const [predictions, setPredictions] = useState([]);
  const [activeView, setactiveView] = useState("home");

  const handlePredictions = (predictions) => {
    setPredictions(predictions);
  };

  return (
    <div
      className={` bg-ash-500 flex w-full justify-center h-screen  md:p-11 p-2 flex-col`}
    >
      <Header tab={tab} setTab={setTab} />
      {tab == "home" ? (
        <div className="flex w-full h-full px-2 md:px-9 flex-col">
          {activeView == "home" && (
            <>
              <div className="font-bold text-skinGreen text-center mt-16 text-lg lg:text-3xl">
                WELCOME TO THE SKIN DISEASE DETECTION SYSTEM
              </div>
              <div className="flex w-full justify-center flex-col gap-y-5">
                <div className="flex text-blueText font-semibold self-center mt-10">
                  HOW TO USE
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur. Tempus ipsum urna urna
                  id ultricies arcu bibendum turpis pellentesque. Odio sed nisi
                  tristique lacus varius ac eleifend. Sollicitudin tellus lacus
                  amet at sed. Sociis vel nunc eget aliquam elit molestie. Non
                  netus nulla in vitae lorem bibendum justo vulputate ac. Eu
                  condimentum cras mauris urna. Amet sagittis id vel orci
                  vivamus elit ipsum. Lorem cras id consequat gravida. Nisi in.
                </div>
              </div>
              <div className="font-bold text-skinGreen text-center mt-16 text-lg lg:text-2xl">
                UPLOAD IMAGE(S) BELOW
              </div>
            </>
          )}
          <Antupload
            activeView={activeView}
            setactiveView={(value) => {
              setactiveView(value);
            }}
          />
        </div>
      ) : (
        <About setTab={setTab} setactiveView={setactiveView} />
      )}
    </div>
  );
}

/**
 *
 *  <PredictionPage images={images} predictions={predictions} />
 */

function About({ setTab, setactiveView }) {
  return (
    <div className="flex w-full h-full px-2 md:px-24 flex-col">
      <div className=" mb-4 font-bold text-skinGreen text-center mt-16 text-lg lg:text-3xl">
        ABOUT THIS PROJECT
      </div>
      <div className="flex w-full justify-center flex-col gap-y-5">
        <div>
          Lorem ipsum dolor sit amet consectetur. Tempus ipsum urna urna id
          ultricies arcu bibendum turpis pellentesque. Odio sed nisi tristique
          lacus varius ac eleifend. Sollicitudin tellus lacus amet at sed.
          Sociis vel nunc eget aliquam elit molestie. Non netus nulla in vitae
          lorem bibendum justo vulputate ac. Eu condimentum cras mauris urna.
          Amet sagittis id vel orci vivamus elit ipsum. Lorem cras id consequat
          gravida. Nisi in.
        </div>
      </div>

      <div className="font-bold  mb-4 text-skinGreen text-center mt-20 text-lg lg:text-3xl">
        ABOUT THE AUTHOR
      </div>
      <div className="flex w-full justify-center flex-col gap-y-5">
        <div>
          Lorem ipsum dolor sit amet consectetur. Tempus ipsum urna urna id
          ultricies arcu bibendum turpis pellentesque. Odio sed nisi tristique
          lacus varius ac eleifend. Sollicitudin tellus lacus amet at sed.
          Sociis vel nunc eget aliquam elit molestie. Non netus nulla in vitae
          lorem bibendum justo vulputate ac. Eu condimentum cras mauris urna.
          Amet sagittis id vel orci vivamus elit ipsum. Lorem cras id consequat
          gravida. Nisi in.
        </div>
      </div>

      <button
        onMouseDown={() => {
          setTab("home");
          setactiveView("home");
        }}
        className=" py-5 px-7 mt-8 max-w-80 self-center rounded-2xl bg-skinGreen text-blueText font-semibold "
      >
        TRY IT NOW!
      </button>
    </div>
  );
}

function Header({ setTab, tab }) {
  return (
    <div className="relative flex justify-center  w-full mt-12 ">
      <div className="text-2xl hidden  w-auto top-0 left-0 absolute text-nowrap font-extrabold self-start lg:flex font-lilita-one text-blueText ">
        Skin disease detection{" "}
      </div>

      <div className="gap-2 flex flex-row self-center gap-x-5 font-source-sans font-semibold text-2xl">
        <button
          onMouseDown={() => setTab("home")}
          className={` ${
            tab == "home"
              ? " underline font-bold text-skinGreen "
              : " text-blueText "
          } `}
        >
          Home{" "}
        </button>
        <button
          onMouseDown={() => setTab("about")}
          className={` ${
            tab == "about"
              ? " underline font-bold text-skinGreen "
              : " text-blueText "
          } `}
        >
          About{" "}
        </button>
      </div>
      <div></div>
    </div>
  );
}

export default App;
