import axios from "axios";
import React, { useState } from "react";

interface Props {
  apiUrl: string;
}

const SetupTwoFactor: React.FC<Props> = ({ apiUrl }) => {
  const [recoveryCodes, setRecoveryCodes] = useState<Array<string>>([]);
  const [twoFactorySecret, setTwoFactorSecret] = useState<string>("");

  const handleTwoFactorSetup = async () => {
    await axios.post(`${apiUrl}/user/confirm-password`, {
      password: "password",
    });

    await axios.post(`${apiUrl}/user/two-factor-authentication`);

    let recoveryCodes = await axios.get(
      `${apiUrl}/user/two-factor-recovery-codes`
    );

    let twoFactorSecret = await axios.get(`${apiUrl}/user/two-factor-secret`);

    setRecoveryCodes(recoveryCodes.data);
    setTwoFactorSecret(twoFactorSecret.data);
  };
  return (
    <>
      <div id="twoFactorSecret">{twoFactorySecret}</div>
      <div id="recoveryCodes">{JSON.stringify(recoveryCodes)}</div>
      <button data-testid="enable-two-factor" onClick={handleTwoFactorSetup}>
        Enable two factor authentication
      </button>
    </>
  );
};

export default SetupTwoFactor;
