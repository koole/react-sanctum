import React, { useState, useEffect } from "react";
import { useSanctum } from "react-sanctum";
import { authenticator } from "otplib";

const WithFactor: React.FC = () => {
  const { signIn, twoFactorChallenge } = useSanctum();
  const [code, setCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [twoFactorForm, setTwoFactorForm] = useState<boolean>(false);

  useEffect(() => {
    setCode(authenticator.generate(secret));
  }, [secret]);

  const handleSignIn = () => {
    signIn("user.1@example.org", "password").then(({ twoFactor }) => {
      if (twoFactor) {
        setTwoFactorForm(true);
      }
    });
  };

  const handleChallenge = () => {
    twoFactorChallenge(code, false);
  };

  if (twoFactorForm) {
    return (
      <>
        <input
          type="text"
          data-testid="two-factor-secret"
          onInput={(event) => setSecret(event.currentTarget.value)}
        />
        <input type="text" value={code} />
        <button
          data-testid="login-two-factor-sign-in"
          onClick={handleChallenge}
        >
          Sign in
        </button>
      </>
    );
  } else {
    return (
      <button data-testid="login-with-factor" onClick={handleSignIn}>
        Login with two factor authentication
      </button>
    );
  }
};

export default WithFactor;
