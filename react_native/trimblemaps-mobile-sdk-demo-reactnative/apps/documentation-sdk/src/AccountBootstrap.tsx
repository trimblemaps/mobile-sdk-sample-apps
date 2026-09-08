import {
  Account,
  AccountManager,
  LicensedFeature,
} from "@trimblemaps/maps-react-native";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { TrimbleApiKeyContext } from "./TrimbleApiKeyContext";

type Props = {
  apiKey: string;
  children: ReactNode;
};

export function AccountBootstrap({ apiKey, children }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    if (!apiKey) {
      setError(
        "Missing API key. Set TRIMBLE_MAPS_API_KEY or trimble.config.local.js at the repo root.",
      );
      return;
    }

    try {
      await AccountManager.initialize(
        new Account({
          apiKey,
          licensedFeatures: [
            LicensedFeature.MapsSDK,
            LicensedFeature.NavigationSDK,
          ],
        }),
      );
      await AccountManager.awaitInitialization();
      setReady(true);
    } catch (initError) {
      setError(
        initError instanceof Error
          ? initError.message
          : "Account initialization failed",
      );
    }
  }, [apiKey]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Initializing TrimbleMaps…</Text>
      </View>
    );
  }

  return (
    <TrimbleApiKeyContext.Provider value={apiKey}>
      <View style={styles.flex}>{children}</View>
    </TrimbleApiKeyContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 16 },
  errorText: { color: "#b00020", textAlign: "center" },
});
