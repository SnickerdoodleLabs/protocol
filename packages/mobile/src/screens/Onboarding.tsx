import { View } from "@motify/components";
import React from "react";
import { ProfileForm } from "../components/ProfileForm/ProfileForm";

export default function Onboarding(props) {
  const { navigation } = props;
  return (
    <View>
      <ProfileForm navigation={navigation} />
    </View>
  );
}
