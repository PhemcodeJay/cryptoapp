import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

const injected = new InjectedConnector({ supportedChainIds: [1, 56, 137] });

export default function WalletConnect() {
  const { activate, deactivate, account, active } = useWeb3React();

  return (
    <div>
      {active ? (
        <button onClick={deactivate}>Disconnect ({account})</button>
      ) : (
        <button onClick={() => activate(injected)}>Connect Wallet</button>
      )}
    </div>
  );
}
