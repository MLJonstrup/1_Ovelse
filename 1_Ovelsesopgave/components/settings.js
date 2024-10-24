import React from 'react';
import { Text, View, Switch } from 'react-native';
import globalStyles from '../globalStyles'; // Adjust the path as necessary

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Dark Mode</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isDarkMode}
      />
    </View>
  );
}
