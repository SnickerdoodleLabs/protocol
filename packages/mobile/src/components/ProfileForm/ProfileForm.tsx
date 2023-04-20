import React, { useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Formik, Field, Form } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";

import AnimatedLottieView from "lottie-react-native";
import profileFormLottie from "../../assets/lotties/profileForm.json";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Dropdown from "./Dropdown";
import { MotiView } from "@motify/components";
import { Easing } from "react-native-reanimated";
import DatePicker from "react-native-date-picker";
import { ROUTES } from "../../constants";
import DropDownPicker from "react-native-dropdown-picker";
import { useAppContext } from "../../context/AppContextProvider";
import { UnixTimestamp } from "@snickerdoodlelabs/objects";
import { countries } from "../../services/interfaces/objects/Countries";

export const ProfileForm = ({ navigation }) => {
  const [selected, setSelected] = React.useState(undefined);
  const [dateOfBirthday, setDateOfBirthday] = React.useState<Date | null>(null);
  const [country, setCountry] = React.useState(null);
  const [gender, setGender] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [countryOpen, setCountryOpen] = React.useState(false);
  const [genderOpen, setGenderOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const { mobileCore } = useAppContext();

  const genderData = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-Binary", value: "nonbinary" },
  ];
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.2)",
      zIndex: 1,
    },
    walletConnectBtn: {
      backgroundColor: "orange",
      borderWidth: 0,
      color: "#FFFFFF",
      borderColor: "#8079B4",
      width: 280,
      height: 65,
      borderRadius: 60,
      alignItems: "center",
      /*     borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 30,
        marginBottom: 30,
        paddingTop: 5, */
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    walletConnectMainBtn: {
      backgroundColor: "orange",
      borderWidth: 0,
      color: "#FFFFFF",
      borderColor: "#8079B4",
      width: 280,
      height: 65,
      borderRadius: 60,
      alignItems: "center",
      /*     borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 30,
        marginBottom: 30,
        paddingTop: 5, */
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
  });
  function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return month + "/" + day + "/" + year;
  }

  return (
    <View style={{ width: 350 }}>
      <View style={{ zIndex: 2 }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "90%", borderRadius: 50, zIndex: 999 }}>
            <DropDownPicker
              style={{ borderWidth: 0, backgroundColor: "#efefef" }}
              open={countryOpen}
              value={country}
              items={countries ?? []}
              setOpen={setCountryOpen}
              setValue={setCountry}
              theme="LIGHT"
              placeholder="Select Country"
            />
          </View>

          <View style={{ width: "90%", paddingTop: 30, zIndex: 998 }}>
            <DropDownPicker
              style={{ borderWidth: 0, backgroundColor: "#efefef" }}
              open={genderOpen}
              value={gender}
              items={genderData ?? []}
              setOpen={setGenderOpen}
              setValue={setGender}
              theme="LIGHT"
              placeholder="Select Gender"
            />
          </View>
          <View style={{ paddingTop: 30 }}>
            <TouchableOpacity
              style={{
                width: 310,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#efefef",
                height: 50,
                zIndex: 1,
                borderRadius: 10,
              }}
              onPress={() => setOpen(true)}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                  paddingLeft: 10,
                  fontSize: 14,
                }}
              >
                {dateOfBirthday
                  ? `${getFormattedDate(dateOfBirthday)}`
                  : "Date Of Birthday"}
              </Text>
            </TouchableOpacity>
            <DatePicker
              style={{}}
              modal
              open={open}
              date={date}
              mode="date"
              onConfirm={(date) => {
                setOpen(false);
                setDateOfBirthday(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ paddingTop: 20 }}>
        <Button
          title="Finish"
          onPress={async () => {
            gender && mobileCore.piiService.setGender(gender);
            country && mobileCore.piiService.setLocation(country);
            dateOfBirthday &&
              mobileCore.piiService.setBirthday(
                UnixTimestamp(dateOfBirthday.getTime() / 1000),
              );
            navigation.replace(ROUTES.WALLET);
          }}
        />
      </View>
    </View>
  );
};
