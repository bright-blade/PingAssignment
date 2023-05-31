import { useEffect, useState } from "react";
import "./style.css";
import PingForm from "./components/PingForm";
import Output from "./components/Output";
import TopFivePingSites from "./components/TopFivePingSites";
import { resetSession } from "./axios/ping";

function App() {
  const [outputText, setOutputText] = useState("");
  const [topFive, setTopFive] = useState<
    | {
        hostName: string;
        count: number;
      }[]
    | undefined
  >();

  useEffect(() => {
    resetSession().then(({ data }) => {
      console.log("data", data);
    });
  }, []);

  return (
    <div className="app">
      <h1>Wellcome to the ping web</h1>
      <PingForm setOutputText={setOutputText} setTopFive={setTopFive} />
      <Output outputText={outputText} />
      <TopFivePingSites topFive={topFive} />
    </div>
  );
}

export default App;
