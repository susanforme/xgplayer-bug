import { useImmer } from "use-immer";
import "./App.css";
import Player from "./Player";
import { useState } from "react";

function App() {
  const [state, setState] = useState([
    {
      name: "Origin 1",
      url: "http://localhost:5173/video/0001-4kcountry-road.m3u8",
      definition: "1080p",
    },
  ]);
  return (
    <>
      <Player
        option={{
          isLive: true,
        }}
        origins={state}
      ></Player>
    </>
  );
}

export default App;
