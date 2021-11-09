import { firebase } from './fb';
import React, { useState, useEffect } from 'react';
import { NativeRouter, Route, Link } from 'react-router-native';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Surface,
} from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import tw from 'tailwind-react-native-classnames';
import 'react-native-gesture-handler';
import SiteContext from './utils/site-context';
import Nav from './components/nav';
import logo from './assets/whslogo.png';
import icon from './assets/snack-icon.png';
import announcementIcon from './assets/announcementIcon.png';
import chatIcon from './assets/white-chat-icon-467078.png';
import listIcon from './assets/checklist_white_icon.png';
import emptyProfilePic from './assets/emptyProfilePic.png';
import Announcements from './pages/announcements';
import MyAccount from './pages/myAccount';
import Admin from './pages/admin';
import Chat from './pages/chat';

export default function Home() {

  let [email, setEmail] = useState('test@gmail.com');
  let [pw, setPw] = useState('123test');
  let [confirmPw, setConfirmPw] = useState('');
  let [name, setName] = useState('');
  let [depart, setDepart] = useState('');

  let [lastSignIn, setLastSignIn] = useState(undefined);
  let [creationDate, setCreationDate] = useState(undefined);

  let [isNew, setIsNew] = useState(false);

  let [errMsg, setErrMsg] = useState(undefined);

  let [user, setUser] = useState(undefined);
  let [userData, setUserData] = useState(undefined);
  let [userSecret, setUserSecret] = useState(undefined);

  let [ready, setReady] = useState(false);

  let [highlight1, setHighlight1] = useState(false);
  let [highlight2, setHighlight2] = useState(false);
  let [highlight3, setHighlight3] = useState(false);
  let [highlight4, setHighlight4] = useState(false);

  async function getUserData(user) {
    let userDataDoc = await firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .get();
    let userSecretDoc = await firebase
      .firestore()
      .collection('usersSecret')
      .doc(user.uid)
      .get();

    let newCreationDate = new Date(parseInt(user.metadata.a, 10));
    let newLastSignIn = new Date(parseInt(user.metadata.b, 10));

  

    let userData = {
      ...userDataDoc.data(),
      lastLogin: newLastSignIn,
      creationDate: newCreationDate,
    };

    setUserData(userData);
    setUserSecret(userSecretDoc.data());
    setUser(user);
  }
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        getUserData(user);
      } else {
        setReady(false);
        setIsNew(false);
        setUser(user);
      }
    });
  }, []);

  function change1() {
    setHighlight1(true);
    setHighlight2(false);
    setHighlight3(false);
  }
  function change2() {
    setHighlight1(false);
    setHighlight2(true);
    setHighlight3(false);
  }
  function change3() {
    setHighlight1(false);
    setHighlight2(false);
    setHighlight3(true);
  }
  function change4() {
    setHighlight1(false);
    setHighlight2(false);
    setHighlight3(false);
    setHighlight4(true);
  }
  function isReady() {
    setReady(true);
    setHighlight1(true);
    setHighlight2(false);
    setHighlight3(false);
  }
  function signin() {
    setErrMsg(undefined);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pw)
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setErrMsg(errorMessage);
      });
  }
  function comparePassword() {
    if (pw !== confirmPw) {
      setErrMsg('Passwords do not match.');
    } else {
      signup();
    }
  }

  function signup() {
    setErrMsg(undefined);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {

        var user = userCredential.user;

        firebase.firestore().collection('users').doc(user.uid).set({
          name,
          leader: false,
          depart,
        });
        firebase.firestore().collection('usersSecret').doc(user.uid).set({
          isAdmin: false,
          isSuperAdmin: false,
        });
        firebase.firestore().collection('userNames').doc(user.uid).set({
          name: name,
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setErrMsg(errorMessage);
      });
  }
  if (user) {
    if (ready) {
      if(userSecret.isAdmin){
        return (
        <SiteContext.Provider value={{ user, userData, userSecret }}>
          <NativeRouter>
            <LinearGradient
              colors={['#141e30', '#243b55', '#012057']}
              style={tw`min-h-full`}>
              <Route exact path="/" component={Announcements} />
              <Route path="/announcements" component={Announcements} />
              <Route path="/chat" component={Chat} />
              <Route path="/myaccount" component={MyAccount} />
              <Route path="/admin" component={Admin} />

              <View
                style={tw`absolute bottom-0 right-0 left-0 bg-black flex flex-row h-14 justify-center`}>
                <Link
                  to="/announcements"
                  onPress={change1}
                  style={tw`flex-1 justify-center items-center p-4 ${
                    highlight1 ? '' : ''
                  } `}>
                  <View>
                    <Image
                      source={announcementIcon}
                      style={tw` ${highlight1 ? 'h-10 w-10' : 'h-8 w-8'}`}
                    />
                  </View>
                </Link>
                <Link
                  to="/chat"
                  onPress={change2}
                  style={tw`flex-1 justify-center items-center p-4 ${
                    highlight2 ? '' : ''
                  }`}>
                  <View>
                    <Image
                      source={chatIcon}
                      style={tw` ${highlight2 ? 'h-10 w-10' : 'h-8 w-8'}`}
                    />
                  </View>
                </Link>
                <Link
                  to="/admin"
                  onPress={change3}
                  style={tw`flex-1 justify-center items-center p-4 ${
                    highlight3 ? '' : ''
                  }`}>
                  <View>
                    <Image
                      source={listIcon}
                      style={tw` ${highlight3 ? 'h-8 w-8' : 'h-6 w-6'}`}
                    />
                  </View>
                </Link>
                <Link
                  to="/myaccount"
                  onPress={change4}
                  style={tw`flex-1 justify-center items-center p-4 ${
                    highlight4 ? '' : ''
                  }`}>
                  <View>
                    <Image
                      source={emptyProfilePic}
                      style={tw` ${highlight4 ? 'h-10 w-10' : 'h-8 w-8'}`}
                    />
                  </View>
                  {/*<Text
                    style={tw` text-white ${
                      highlight3 ? 'rounded-full text-lg' : 'text-sm'
                    }`}>
                    My Account
                  </Text>*/}
                </Link>
              </View>
            </LinearGradient>
          </NativeRouter>
        </SiteContext.Provider>
      );
      }else{
      return (
        <SiteContext.Provider value={{ user, userData, userSecret }}>
          <NativeRouter>
            <LinearGradient
              colors={['#141e30', '#243b55', '#012057']}
              style={tw`min-h-full`}>
              <Route exact path="/" component={Announcements} />
              <Route path="/announcements" component={Announcements} />
              <Route path="/chat" component={Chat} />
              <Route path="/myaccount" component={MyAccount} />

              <View
                style={tw`absolute bottom-0 right-0 left-0 bg-black flex flex-row h-14 justify-center`}>
                <Link
                  to="/announcements"
                  onPress={change1}
                  style={tw`flex-1 justify-center items-center p-4 ${
                    highlight1 ? '' : ''
                  } `}>
                  <View>
                    <Image
                      source={announcementIcon}
                      style={tw` ${highlight1 ? 'h-12 w-12' : 'h-10 w-10'}`}
                    />
                  </View>
                </Link>
                <Link
                  to="/chat"
                  onPress={change2}
                  style={tw`flex-1 justify-center items-center p-4 ${
                    highlight2 ? '' : ''
                  }`}>
                  <View>
                    <Image
                      source={chatIcon}
                      style={tw` ${highlight2 ? 'h-12 w-12' : 'h-10 w-10'}`}
                    />
                  </View>
                </Link>
                <Link
                  to="/myaccount"
                  onPress={change3}
                  style={tw`flex-1 justify-center items-center p-4 ${
                    highlight3 ? '' : ''
                  }`}>
                  <View>
                    <Image
                      source={emptyProfilePic}
                      style={tw` ${highlight3 ? 'h-10 w-10' : 'h-8 w-8'}`}
                    />
                  </View>
                  {/*<Text
                    style={tw` text-white ${
                      highlight3 ? 'rounded-full text-lg' : 'text-sm'
                    }`}>
                    My Account
                  </Text>*/}
                </Link>
              </View>
            </LinearGradient>
          </NativeRouter>
        </SiteContext.Provider>
      );
      }
    } else {
      return (
        <SiteContext.Provider value={{ user, userData, userSecret }}>
          <LinearGradient
            colors={['#141e30', '#243b55', '#012057']}
            style={tw`flex flex-1 justify-center items-center p-2`}>
            <Text style={tw`text-white`}>Successful Login!</Text>
            <Text style={tw`text-white`}>Welcome, {userData.name}</Text>
            <NativeRouter>
              <Link
                to="/login"
                onPress={isReady}
                style={tw`flex items-center bg-blue-700 text-white px-2 py-1 rounded shadow`}>
                <Text style={tw`text-white`}>Continue to App</Text>
              </Link>
            </NativeRouter>
          </LinearGradient>
        </SiteContext.Provider>
      );
    }
  } else {
    return (
      <LinearGradient
        colors={['#141e30', '#243b55', '#012057']}
        style={tw`flex flex-1 items-center p-2`}>
        <View>
          <Image source={logo} style={tw`w-80 h-20`} />
        </View>
        <Text style={tw`text-white`}>Music Department</Text>
        <Text style={tw`text-white text-center p-2`}>
          Welcome! Log in or sign up with an account to get started.
        </Text>

        <View style={tw`container p-4`}>
          <TextInput
            style={tw`bg-white p-3 border-b-2 border-black`}
            value={email}
            placeholder="email"
            onChangeText={setEmail}
          />
          <TextInput
            style={tw`bg-white p-3 border-b-2 border-black`}
            value={pw}
            secureTextEntry
            placeholder="password"
            onChangeText={setPw}
          />
          {isNew && (
            <TextInput
              style={tw`bg-white p-3 border-black`}
              value={confirmPw}
              secureTextEntry
              placeholder="confirm password"
              onChangeText={setConfirmPw}
            />
          )}
          {isNew && (
            <TextInput
              style={tw`bg-white p-3 border-black`}
              value={name}
              placeholder="first and last name"
              onChangeText={setName}
            />
          )}
          {isNew && (
            <TextInput
              style={tw`bg-white p-3 border-black`}
              value={depart}
              placeholder="music department"
              onChangeText={setDepart}
            />
          )}

          {!isNew && (
            <TouchableOpacity
              style={tw`bg-blue-700 p-3 border-black rounded-lg`}
              onPress={signin}>
              <Text style={tw`text-white`}>Login</Text>
            </TouchableOpacity>
          )}
          {
            <TouchableOpacity
              style={tw`bg-blue-700 p-3 mt-1 border-black rounded-lg`}
              onPress={isNew ? comparePassword : () => setIsNew(true)}>
              <Text style={tw`text-white`}>Sign Up</Text>
            </TouchableOpacity>
          }
          {isNew && (
            <TouchableOpacity
              style={tw`bg-blue-700 p-3 mt-1 border-black rounded-lg`}
              onPress={() => setIsNew(false)}>
              <Text style={tw`text-white`}>Return To Login</Text>
            </TouchableOpacity>
          )}

          {errMsg && (
            <View>
              <Text style={tw`text-red-400 text-center`}>{errMsg}</Text>
            </View>
          )}
        </View>

        {/*<TouchableOpacity
          onPress={loggedIn}
          style={tw`flex items-center space-x-2 bg-blue-700 text-white px-2 py-1 rounded shadow focus:outline-none hover:bg-blue-600`}>
          <Text style={tw`text-white`}>Sign in with Google</Text>
        </TouchableOpacity>*/}
      </LinearGradient>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: 'hotpink',
    justifyContent: '',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  bigFont: {
    fontSize: 50,
    color: 'white',
  },
  logo: {
    width: 350,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    margin: 1,
    minWidth: 200,
  },
  whiteText: {
    color: 'white',
  },
};
