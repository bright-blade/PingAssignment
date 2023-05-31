import React, { useState } from "react";
import "../style.css";
import { getTopFive, sendPing } from "../axios/ping";

type Props = {
  setOutputText: (data: string) => void;
  setTopFive: React.Dispatch<
    React.SetStateAction<
      | {
          hostName: string;
          count: number;
        }[]
      | undefined
    >
  >;
};

const PingForm: React.FC<Props> = ({ setOutputText, setTopFive }) => {
  const [countValue, setCountValue] = useState<string>("1");
  const [hostNameValue, setHostNameValue] = useState("");
  const submitPingForm = () => {
    if (hostNameValue === "") {
      return;
    }

    sendPing({ hostName: hostNameValue, count: countValue })
      .then(({ data }) => {
        setOutputText(data.message);
        getTopFive().then(({ data }) => {
          setTopFive(data);
        });
      })
      .catch((err) => {
        console.error(err.response.data.status);
      });
  };

  return (
    <form
      method="POST"
      action="/send-ping"
      onSubmit={(event) => {
        event.preventDefault();
        submitPingForm();
      }}
    >
      <label htmlFor="host-name">Host:</label>
      <input
        id="host-name"
        type="text"
        placeholder="enter host name"
        name="host-name"
        value={hostNameValue}
        onChange={(event) => {
          setHostNameValue(event.target.value);
        }}
      />
      <label htmlFor="count-range">Count:</label>

      <input
        type="range"
        min="1"
        max="100"
        value={countValue}
        onChange={(event) => {
          setCountValue(event.target.value);
        }}
        className="slider"
        id="count-range"
      />
      <span id="count-value">{countValue}</span>
      <button type="submit">Run</button>
    </form>
  );
};

export default PingForm;
