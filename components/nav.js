import { useContext } from "react";
import { Link } from "react-router-dom";
import { fapp, firebase } from "../fb";
import SiteContext from "../utils/site-context";
import React, { useState, useEffect, nav } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import tw from 'tailwind-react-native-classnames';
import 'react-native-gesture-handler';
export default function Nav() {

  return (
    <View>
      <Link to="/login"><Text>login</Text></Link>
    </View>
  );
}
