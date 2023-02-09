import { renderIcon } from "@download/blockies";
import { AccountAddress } from "@snickerdoodlelabs/objects";
import React, { useEffect, useRef, useState } from "react";

interface IAccountIdentIconProps {
  accountAddress: AccountAddress;
  size?: number;
}
const AccountIdentIcon = ({
  accountAddress,
  size = 40,
}: IAccountIdentIconProps) => {
  const [dataUrl, setDataUrl] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = renderIcon(
      { seed: accountAddress.toLowerCase() },
      canvasRef.current,
    );
    const updatedDataUrl = canvas.toDataURL();

    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl);
    }
  }, [dataUrl, accountAddress]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img
        src={dataUrl}
        height={size}
        width={size}
        style={{
          borderRadius: size / 2,
        }}
      />
    </>
  );
};

export default AccountIdentIcon;
