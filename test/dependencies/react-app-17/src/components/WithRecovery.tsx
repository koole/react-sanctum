import React, { useState } from "react";
import { useSanctum } from "react-sanctum";

const WithRecovery: React.FC = () => {
  const { signIn, twoFactorChallenge } = useSanctum();
  const [code, setCode] = useState<string>("");
  const [twoFactorForm, setTwoFactorForm] = useState<boolean>(false);

  const handleSignIn = () => {
    signIn("user.1@example.org", "password").then(({ twoFactor }) => {
      if (twoFactor) {
        setTwoFactorForm(true);
      }
    });
  };

  const handleChallenge = () => {
    twoFactorChallenge(code, true);
  };

  if (twoFactorForm) {
    return (
      <>
        <input
          type="text"
          data-testid="recovery-code"
          onInput={(event) => setCode(event.currentTarget.value)}
        />
        <button data-testid="login-recovery-sign-in" onClick={handleChallenge}>
          Sign in
        </button>
      </>
    );
  } else {
    return (
      <button data-testid="login-with-recovery" onClick={handleSignIn}>
        Login with recovery code
      </button>
    );
  }
};

export default WithRecovery;
