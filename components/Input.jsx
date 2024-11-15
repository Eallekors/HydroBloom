import React, { useState } from "react";
import { TextInput, View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function Input({
  label,
  placeholder,
  isPassword,
  value,
  onChangeText,
  onSubmitEditing,
  returnKeyType,
  style,
  type,
  options,
  ...props
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [timeValue, setTimeValue] = useState(value || "");

  const onEyePress = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleTimeChange = (text) => {
    // Remove any non-numeric characters except for ":"
    let formattedText = text.replace(/[^\d]/g, "");
  
    // Extract hour and minute portions
    let hours = formattedText.slice(0, 2);
    let minutes = formattedText.slice(2, 4);
  
    // Restrict hour to 23 max and minute to 59 max
    if (parseInt(hours, 10) > 23) hours = "23";
    if (minutes && parseInt(minutes, 10) > 59) minutes = "59";
  
    // Add colon if 2 or more characters are present in the hour portion
    if (formattedText.length > 2) {
      formattedText = `${hours}:${minutes}`;
    } else {
      formattedText = hours;
    }
  
    setTimeValue(formattedText);
    onChangeText(formattedText);
  };
  
  const isValidTimeFormat = (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    return regex.test(time);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {type === "picker" ? (
        <Dropdown
          data={options}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={value}
          onChange={(item) => onChangeText(item.value)}
          style={[styles.dropdown, style]}
        />
      ) : type === "time" ? (
        <View style={styles.inputContainer}>
          <TextInput
            value={timeValue}
            onChangeText={handleTimeChange}
            placeholder={placeholder || "HH:mm"}
            style={[styles.input, style]}
            keyboardType="numeric"
            maxLength={5}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType || "done"}
            {...props}
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !isPasswordVisible}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType || "done"}
            placeholder={placeholder}
            style={[styles.input, style]}
            keyboardType={type === "email" ? "default" : type === "number" ? "numeric" : "default"}
            {...props}
          />
          {isPassword && (
            <Pressable onPress={onEyePress}>
              <Image
                style={styles.eye}
                source={
                  isPasswordVisible
                    ? require('../assets/images/open_eye.png')
                    : require('../assets/images/hide_eye.png')
                }
              />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#241F5E",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  eye: {
    width: 20,
    height: 20,
    tintColor: "#666",
    marginLeft: 10,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 5,
    color: "#333",
    width: "100%",
    textAlign: "center",
  },
  selectedOption: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
