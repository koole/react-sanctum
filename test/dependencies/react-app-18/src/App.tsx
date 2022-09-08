import React from "react";
import WithoutFactor from "./components/WithoutFactor";
import { useSanctum } from "react-sanctum";
import SetupTwoFactor from "./components/SetupTwoFactor";
import WithFactor from "./components/WithFactor";
import WithRecovery from "./components/WithRecovery";
import SignOut from "./components/SignOut";

interface Props {
  apiUrl: string;
}

const App: React.FC<Props> = ({ apiUrl }) => {
  const { authenticated } = useSanctum();

  return (
    <>
      {authenticated ? (
        <>
          <p data-testid="signed-in">You are signed in</p>
          <SetupTwoFactor apiUrl={apiUrl} />
          <SignOut />
        </>
      ) : (
        <>
          <p data-testid="signed-out">You are not signed in</p>
          <WithoutFactor />
          <WithFactor />
          <WithRecovery />
        </>
      )}
    </>
  );
};

export default App;
