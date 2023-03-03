import React from "react";
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
import { countries } from "../../constants/countries";
import Dropdown from "./Dropdown";
import { MotiView } from "@motify/components";
import { Easing } from "react-native-reanimated";
import DatePicker from "react-native-date-picker";
import { ROUTES } from "../../constants";

export const ProfileForm = ({ navigation }) => {
  const [selected, setSelected] = React.useState(undefined);
  const [dateOfBirthday, setDateOfBirthday] = React.useState<Date | null>(null);
  const [country, setCountry] = React.useState(null);
  const [gender, setGender] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

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

  const onSubmit = (values) => {
    console.log("values", values);
  };
  const handleSubmit = () => {
    console.log({ country, gender, dateOfBirthday });
  };
  return (
    <View style={{ width: 350 }}>
      <View>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "90%", borderRadius: 50 }}>
            <Dropdown
              label="Select Country"
              data={countries}
              onSelect={(e) => {
                setCountry(e.value);
              }}
            />
          </View>

          <View style={{ width: "90%", paddingTop: 30 }}>
            <Dropdown
              label="Select Gender"
              data={genderData}
              onSelect={(e) => {
                setGender(e.value);
              }}
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
                  textAlign: "center",
                }}
              >
                {dateOfBirthday
                  ? `${getFormattedDate(dateOfBirthday)}`
                  : "Date Of Birthday"}
              </Text>
            </TouchableOpacity>
            <DatePicker
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
          onPress={() => {
            navigation.replace(ROUTES.WALLET);
          }}
        />
      </View>
    </View>
  );
};
