import { type Web3AuthContextConfig } from "@web3auth/modal/react";
import {
  WALLET_CONNECTORS,
  WEB3AUTH_NETWORK,
  MFA_LEVELS,
  type Web3AuthOptions,
} from "@web3auth/modal";

const web3AuthOptions: Web3AuthOptions = {
  clientId: process.env.WEB3_AUTH_CLIENT_ID || "",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  modalConfig: {
    connectors: {
      [WALLET_CONNECTORS.AUTH]: {
        label: "auth",
        loginMethods: {
          google: {
            name: "google login",
            // logoDark: "url to your custom logo which will shown in dark mode",
          },
          facebook: {
            name: "facebook login",
            showOnModal: false, // hides the facebook option
          },
          email_passwordless: {
            name: "email passwordless login",
            showOnModal: true,
            authConnectionId: "w3a-email_passwordless-demo",
          },
        },
        showOnModal: true, // set to false to hide all social login methods
      },
    },
    hideWalletDiscovery: true, // set to true to hide external wallets discovery
  },
  mfaLevel: MFA_LEVELS.MANDATORY,
};

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
};