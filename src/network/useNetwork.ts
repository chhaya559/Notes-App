import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsub();
  }, []);

  return isOnline;
};
