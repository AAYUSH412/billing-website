import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function Example() {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  return (
    <div>
      <button onClick={() => reactToPrintFn()}>Print</button>
      <div ref={contentRef}>Content to print</div>
    </div>
  );
}

export default Example;