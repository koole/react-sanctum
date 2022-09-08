import React from "react";
import { useSanctum } from "react-sanctum";

const SignOut: React.FC = () => {
  const { signOut } = useSanctum();

  return (
    <button data-testid="sign-out" onClick={signOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
