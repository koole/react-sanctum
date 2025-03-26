import React from "react";
import { useSanctum } from "react-sanctum";

const WithoutFactor: React.FC = () => {
  const { signIn } = useSanctum();

  return (
    <button
      data-testid="login-without-factor"
      onClick={() => signIn("user.1@example.org", "password")}
    >
      Login without two factor authentication
    </button>
  );
};

export default WithoutFactor;
