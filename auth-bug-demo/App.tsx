import {
  AuthRequest,
  AuthRequestConfig,
  Prompt,
  ResponseType,
  exchangeCodeAsync,
  makeRedirectUri,
  useAutoDiscovery,
} from "expo-auth-session";
import "expo-dev-client";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const redirectUri = `${makeRedirectUri({})}expo-development-client`;

const authRequestOptions: AuthRequestConfig = {
  usePKCE: true,
  responseType: ResponseType.Code,
  clientId: "demoapp",
  redirectUri,
  prompt: Prompt.Login,
  scopes: ["openid", "profile", "email", "offline_access"],
  extraParams: {
    access_type: "offline",
  },
};

export default function App() {
  const discovery = useAutoDiscovery(`http://10.0.2.2:5010/realms/demoapp`);

  console.log("@@ discovery", discovery);

  const login = async () => {
    const authRequest = new AuthRequest({
      ...authRequestOptions,
      state: Math.random().toString(36).substring(2, 15),
    });

    console.log("@@ authorization endpoint", discovery?.authorizationEndpoint);
    console.log("@@ authRequest", authRequest);
    const authorizeResult = await authRequest.promptAsync({
      authorizationEndpoint: discovery?.authorizationEndpoint,
    });
    console.log("@@ authorizeResult", authorizeResult);

    console.log("@@ exchange code");
    const response = await exchangeCodeAsync(
      {
        code: (authorizeResult as any)?.params?.code,
        clientId: "demoapp",
        redirectUri,
        extraParams: {
          code_verifier: authRequest.codeVerifier as string,
        },
      },
      { tokenEndpoint: discovery?.tokenEndpoint }
    );
    console.log("@@ exchange code response", response);
    if (response?.idToken && response?.refreshToken) {
      console.log("@@ exchange code response idToken", response.idToken);
      console.log(
        "@@ exchange code response refreshToken",
        response.refreshToken
      );
    }
    console.log("@@ exchange code response idToken", response?.idToken);
  };

  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}
    >
      <TouchableOpacity onPress={() => login()}>
        <Text
          style={{
            fontSize: 30,
            backgroundColor: "black",
            borderRadius: 20,
            padding: 20,
            color: "white",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
