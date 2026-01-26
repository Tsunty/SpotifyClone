import Loading from "@/components/Onboarding/Loading";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { IP_back } from "@/components/interfaces";

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const response = await fetch(`http://${IP_back}:4444/isAuth`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) router.replace("/getStarted");
        router.replace("/(tabs)");
      } catch (error) {
        console.log(error);
      }
    };
    checkToken();
  }, []);

  return <Loading />;
}
