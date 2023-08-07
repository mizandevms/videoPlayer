import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsplaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    });
  }, []);

  const playVideo = () => {
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsplaying((currentPlayStatus) => !currentPlayStatus);
  };
  const tenPad = (time) => {
    if (time < 10) {
      return `0${time}`;
    } else {
      return time;
    }
  };
  const formatTime = (duration) => {
    const one_second = 60;
    const minutes = Math.floor(duration / one_second);
    const seconds = Math.floor(duration - minutes * one_second);
    const formattedTime = `${tenPad(minutes)} : ${tenPad(seconds)}`;
    return formattedTime;
  };

  const [jumpTime, setJumpTime] = useState(0);
  const jump_time_factor = 5;
  const handleSkipForward = () => {
    if (
      videoRef.current?.duration - videoRef.current.currentTime >
      jump_time_factor
    ) {
      setJumpTime((currentJumpTime) => currentJumpTime + jump_time_factor);
      videoRef.current.currentTime = Math.floor(
        videoRef.current.currentTime + jump_time_factor
      );
    }
  };

  return (
    <div className="App relative " ref={videoWrapperRef}>
      <video
        className="w-full mx-auto my-8 "
        ref={videoRef}
        onCanPlayThrough={() => {
          // alert(videoRef.current.duration);
          setVideoDuration(videoRef.current.duration);
          setIsLoading(false);
        }}
        onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
        onEnded={() => setIsplaying(false)}
      >
        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" />
      </video>
      {/* video overlay */}
      <div className="absolute left-0 right-0 top-0 w-full h-full flex flex-col justify-end">
        <div>{isLoading ? "Clam downand grab  a cup of coffee" : ""}</div>
        {/* progress bar */}
        <div className="  bg-gray-200 h-1 w-[98%] mx-auto mb-8">
          {/* Progress bar inner style */}
          <div
            className={
              "bg-red-600 w-[0%] h-full " +
              (videoRef.current?.ended ? "" : "progressBarInner")
            }
            style={{
              animationPlayState:
                isPlaying && !isLoading ? "running" : "paused",
              animationDuration: videoRef.current?.ended
                ? `0s`
                : `${Math.ceil(videoRef.current?.duration - jumpTime)}s`,
            }}
          ></div>
        </div>

        {/* video controls */}
        <div className="text-gray-500 flex justify-between items-center w-[98%] mx-auto pb-4">
          <div className="flex justify-start items-center gap-x-4">
            {currentTime !== videoDuration ? (
              <button onClick={playVideo}>
                {isPlaying ? "Pause" : "Play"}
              </button>
            ) : (
              <button onClick={playVideo}>Replay</button>
            )}
            <p className="cursor-pointer" onClick={() => handleSkipForward()}>
              Skip 5 Sec
            </p>
          </div>
          {/* <button onClick={playVideo}>{isPlaying ? "Pause" : "Play"}</button> */}
          <p className="inline-block ">
            {formatTime(currentTime)} / {formatTime(videoDuration)}
          </p>
          <p
            className="cursor-pointer"
            onClick={() => {
              if (isFullScreen) {
                document.exitFullscreen();
              } else {
                videoWrapperRef.current.requestFullscreen();
              }
              setIsFullScreen((prevState) => !prevState);
            }}
          >
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
