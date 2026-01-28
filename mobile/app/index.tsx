import Loading from "@/components/Onboarding/Loading";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { IP_back } from "@/components/interfaces";

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return <Loading />;
}
