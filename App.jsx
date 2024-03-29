import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-simple-toast";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";
import init from "react_native_mqtt";
import SwitchButton from "./components/SwitchButton";

// here we're using hivemq.com as our mqtt platform
// to create and find mqtt creadentials we've to go https://console.hivemq.cloud/
// for more info please visit https://www.hivemq.com/public-mqtt-broker/
const topic = "iot/remote-control";
const topic2 = "iot/state";
const mqtt_connection_uri =
  "2604f5a910dd4fb8a95f9c302739ff6c.s2.eu.hivemq.cloud";
const mqtt_port = 8884;

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

const App = () => {
  const [apiData, setApiData] = useState({});
  const [newClient, setNewClient] = useState();

  const initialize = () => {
    function onConnect() {
      client.subscribe(topic, { qos: 1 });

      publishMessage("get-state", topic2);
    }

    function onFailure() {
      Toast.show("MQTT connection failed!", Toast.SHORT);
    }

    function publishMessage(message, topic = topic) {
      const newMessage = new Paho.MQTT.Message(message);

      newMessage.destinationName = topic;

      client.send(newMessage);
    }

    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        Toast.show("MQTT connection lost!", Toast.SHORT);
      }
    }

    function onMessageArrived(message) {
      console.log(JSON.parse(message.payloadString));
      setApiData(JSON.parse(message.payloadString));
    }

    // mqtt connection related code
    const client = new Paho.MQTT.Client(
      mqtt_connection_uri,
      mqtt_port,
      "clientId-" + parseInt(Math.random() * 100, 10)
    );
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
      onSuccess: onConnect,
      onFailure: onFailure,
      useSSL: true,
      userName: "mainuddin01",
      password: "anjumkhan1995",
    });
    setNewClient(client);
  };

  const handlePress = (data) => {
    try {
      const newMessage = new Paho.MQTT.Message(JSON.stringify(data));

      newMessage.destinationName = topic2;

      newClient.send(newMessage);
    } catch (errors) {
      Toast.show("Something wen't wrong!", Toast.SHORT);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <View style={styles.appContainer}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="nintendo-switch"
          style={styles.liveIcon}
          color="#fff"
          size={24}
        />
        <Text style={styles.headerText}>Smart Switch App</Text>
      </View>
      <View style={styles.main}>
        <View
          style={[
            styles.headingLive,
            {
              marginTop: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "ce",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="circle-slice-8"
            color="#f00"
            size={18}
          />
          <Text style={[styles.headingText, { color: "#333" }]}>
            Live video streaming
          </Text>
        </View>
        {/* <View style={styles.videoContainer}>{renderCamera()}</View> */}
        <View style={styles.liveStreamContainer}>
          <WebView
            source={{ uri: "http://proxy61.rt3.io:30498/" }}
            style={{ flex: 1 }}
          />
        </View>
        <View
          style={[
            styles.headingRow,
            {
              backgroundColor: "#bfdbfe",
              marginVertical: 5,
              borderWidth: 2,
              borderColor: "#3b82f6",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="chevron-triple-right"
            color="#000"
            size={24}
          />
          <Text style={[styles.headingText, { color: "#000" }]}>Switches</Text>
        </View>
        {/* Display SwitchButtons based on apiData */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.switchesContainer}>
            {Object.keys(apiData).length !== 0 ? (
              Object.keys(apiData).map((key) => (
                <SwitchButton
                  key={key}
                  load={key}
                  state={apiData[key]}
                  onPress={handlePress}
                />
              ))
            ) : (
              <View style={{ flex: 1, alignItems: "center", marginTop: 100 }}>
                <MaterialCommunityIcons
                  name="cloud-alert"
                  color="#f00"
                  size={100}
                />
                <Text
                  style={{
                    color: "#f00",
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Failed to connect Raspberry pi server...
                </Text>
                <Text style={{ color: "#000", textAlign: "center" }}>
                  Switches will be shown once its connected to Raspberry pi
                  server!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#ffedd5",
  },
  main: {
    flex: 1,
    paddingHorizontal: 5,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    // marginTop: 6,
  },
  headingText: {
    marginLeft: 8,
    fontWeight: "bold",
    color: "#fff",
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#5661f1",
    paddingHorizontal: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    // marginLeft: 3,
  },
  liveIcon: {
    marginRight: 10,
  },
  liveStreamContainer: {
    // flex: 1,
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0284c7",
    overflow: "hidden",
    marginVertical: 5,
  },
  videoContainerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  camera: {
    flex: 1,
    aspectRatio: 4 / 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  switchesContainer: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 5,
  },
});

export default App;
