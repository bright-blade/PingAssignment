import { useState } from "react";

type Props = {
  outputText: string | undefined;
};

const Output: React.FC<Props> = ({ outputText }) => {
  return (
    <>
      <div className="output-title label">Output:</div>
      <textarea
        id="output-area"
        value={outputText}
        onChange={() => {}}
        cols={32}
        rows={10}
      ></textarea>
    </>
  );
};

export default Output;
