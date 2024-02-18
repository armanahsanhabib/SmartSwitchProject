import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SwitchButton = ({ load, state, onPress }) => {
  return (
    <View style={styles.switchContainer}>
      <Pressable
        style={[
          styles.switchStyle,
          { backgroundColor: state ? "#059669" : "#ffe4e6" },
          { borderColor: state ? "#059669" : "#e11d48" },
          { borderWidth: state ? 2 : 1 },
        ]}
        onPress={() => onPress({ load, state: state == 0 ? 1 : 0 })}
      >
        <MaterialCommunityIcons
          name="power"
          color={state ? "#fff" : "#eb4034"}
          size={32}
        />
        <Text
          style={[styles.switchText, { color: state ? "#fff" : "#eb4034" }]}
        >{`Switch - ${load}`}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: "30%", // Each container takes up 1/3rd of the row's width
    aspectRatio: 1, // Ensure the container is square
    marginBottom: 10, // Add some margin between the buttons
  },
  switchStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#e3e3fd",
    paddingVertical: 10,
  },
  switchText: {
    fontWeight: "700",
    marginTop: 2,
  },
});

export default SwitchButton;
