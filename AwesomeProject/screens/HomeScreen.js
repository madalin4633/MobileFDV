import React, { Component, useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Linking, FlatList, Text, Alert } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { useFonts } from '@expo-google-fonts/inter';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebaseDb';
import LoadingScreen from './LoadingScreen';
import EntypoIcon from "react-native-vector-icons/Entypo";


function HomeScreen(props) {
  const navigation = useNavigation();

  const { user, setUser } = useContext(AuthContext);
  const [type, setType] = useState('');
  const [edit, setEdit] = useState('');
  const [articles, setArticles] = useState('');
  const [tab, setTab] = useState(1);
  const [volunteers, setVolunteers] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [refused, setRefused] = useState([]);

  const isMounted = useRef(null);

  const getArticles = async () => {
    fetch('https://newsapi.org/v2/everything?q=voluntar&apiKey=e2e652c4424d404c9b139351e49602e4')
      .then(response => response.json())
      .then(data => setArticles(data.articles));
  }
  if(articles==='')
    getArticles();
  
  const getVolunteersPending = async () => {
    var database2 = firebase.database();
    ngosDataObject = await database2.ref('/ngos/' + user.uid.toString() + "/pending/").on('value', function (snapshot) {
      var volunteersHere = [];
      if (snapshot.numChildren() != 0)
        snapshot.forEach(function (childSnapshot) {
          let object = {};
          object['name'] = childSnapshot.toJSON().name;
          object['id'] = childSnapshot.toJSON().user;
          volunteersHere.push(object);
        });
      setVolunteers(volunteersHere);
    });
  }

  const getVolunteersAccepted = async () => {
    var database2 = firebase.database();
    ngosDataObject = await database2.ref('/ngos/' + user.uid.toString() + "/accepted/").on('value', function (snapshot) {
      var volunteersHere = [];
      if (snapshot.numChildren() != 0)
        snapshot.forEach(function (childSnapshot) {
          let object = {};
          object['name'] = childSnapshot.toJSON().name;
          object['id'] = childSnapshot.toJSON().user;
          volunteersHere.push(object);
        });
      setAccepted(volunteersHere);
    });
  }

  const getVolunteersRefused = async () => {
    var database2 = firebase.database();
    ngosDataObject = await database2.ref('/ngos/' + user.uid.toString() + "/refused/").on('value', function (snapshot) {
      var volunteersHere = [];
      if (snapshot.numChildren() != 0)
        snapshot.forEach(function (childSnapshot) {
          let object = {};
          object['name'] = childSnapshot.toJSON().name;
          object['id'] = childSnapshot.toJSON().user;
          volunteersHere.push(object);
        });
      setRefused(volunteersHere);
    });
  }
  useEffect(() => {
    isMounted.current = true;
    getVolunteersPending();
    getVolunteersAccepted();
    getVolunteersRefused();

    return () => {
      // executed when unmount
      isMounted.current = false;
    }
}, []);

  if (type === '') {
    var database = firebase.database();
    database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
      var childData = snapshot.val();
      setType(childData.type);
      setEdit(childData.edited);
    });
  }

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <View style={stylesList.container}>
      <TouchableOpacity style={[stylesList.item, backgroundColor]}>
        <Text style={[stylesList.title, textColor]}>{item.title}.</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = "rgba(0,149,218,1)";
    const color = 'white';

    return (
      <Item
        item={item}
        onPress={() => {
          Linking.openURL(item.url);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };



  const Itemm = ({ item, onPress, backgroundColor, textColor }) => (
    <View style={stylesItemm.container}>
      <View onPress={onPress} style={[stylesItemm.item, backgroundColor]}>
        <Text style={[stylesItemm.title, textColor]}>{item.name}</Text>
        <TouchableOpacity style={stylesItemm.touch} onPress={() => {
          let object = [];
          let thisObject = {
            name: item.name,
            id: item.id,
          }
          volunteers.forEach(element => {
            if (element.name != thisObject.name)
              object.push(element);
          });
          setVolunteers(object);
          var database = firebase.database();
          database.ref('/ngos/' + user.uid + '/pending/' + item.id).set({
            user: null,
            name: null
          });
          database.ref('/ngos/' + user.uid + '/accepted/' + item.id).set({
            user: item.id,
            name: item.name
          });
          Alert.alert(item.name + ' a fost acceptat(ă).');
        }}>
          <EntypoIcon name="check" style={stylesItemm.icon3}></EntypoIcon>
        </TouchableOpacity>
        <TouchableOpacity style={stylesItemm.touch} onPress={() => {
          let object = [];
          let thisObject = {
            name: item.name,
            id: item.id,
          }
          volunteers.forEach(element => {
            if (element.name != thisObject.name)
              object.push(element);
          });
          setVolunteers(object);
          var database = firebase.database();
          database.ref('/ngos/' + user.uid + '/pending/' + item.id).set({
            user: null,
            name: null
          });
          database.ref('/ngos/' + user.uid + '/refused/' + item.id).set({
            user: item.id,
            name: item.name
          });
          Alert.alert(item.name + ' a fost respins(ă).');
        }}>
          <EntypoIcon name="cross" style={stylesItemm.icon3}></EntypoIcon>
        </TouchableOpacity>
      </View>
    </View>
  );

  
  const Itemmm = ({ item, onPress, backgroundColor, textColor }) => (
    <View style={stylesItemm.container}>
      <View onPress={onPress} style={[stylesItemm.item, backgroundColor]}>
        <Text style={{fontSize: 14,
    fontFamily: 'Quicksand',
    width: 225, color: "white", }}>{item.name}</Text>
      </View>
    </View>
  );

  const renderItem2 = ({ item }) => {
    const backgroundColor = "rgba(0,149,218,1)";
    const color = 'white';

    if (tab === 1)
      return (
        <Itemm
          item={item}
          backgroundColor={{ backgroundColor }}
          textColor={{ color }}
        />
      );
    else return (
      <Itemmm
        item={item}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  if (edit === 1) {
    if (type === 0)
      return (
        <View style={styles.container}>
          <Image
            source={require("../assets/images/fabrica_de_voluntari.png")}
            resizeMode="contain"
            style={styles.image1}
          ></Image>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
            <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
            <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Voluntari</Text>
          </View>
          <View style={{ height: 290 }}></View>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
            <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
            <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Știri despre "voluntar"</Text>
          </View>
          <Text style={styles.loremIpsum1}>
            Derulează pentru mai multe articole.
          </Text>
          <FlatList
            data={articles}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
          />
          <View style={styles.footerContainer}>
            <MaterialBasicFooter1
              style={styles.materialBasicFooter1}
            ></MaterialBasicFooter1>
          </View>
        </View>
      );
    else return (<View style={styles.container}>
      <Image
        source={require("../assets/images/fabrica_de_voluntari.png")}
        resizeMode="contain"
        style={styles.image1}
      ></Image>

      <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
        <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
        <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Voluntari</Text>
      </View>

      <View style={{ width: Dimensions.get('window').width, height: 280 }}>
        <View style={[stylesTab.container, props.style]}>
          <View style={stylesTab.textWrapper}>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: tab === 1 ? "rgba(0,149,218,1)" : "#FFFFFF",
              padding: 6,
              borderWidth: 1,
              borderColor: "rgba(0,149,218,1)",
              borderBottomLeftRadius: 5,
              borderTopLeftRadius: 5
            }}
              onPress={() => {
                setTab(1);
              }}>
              <Text style={{
                fontSize: 13,
                fontFamily: "Quicksand",
                color: tab === 1 ? "#FFFFFF" : "rgba(0,149,218,1)"
              }}>în așteptare</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: tab === 2 ? "rgba(0,149,218,1)" : "#FFFFFF",
              padding: 6,
              borderWidth: 1,
              borderColor: "rgba(0,149,218,1)",
            }}
              onPress={() => {
                setTab(2);
              }}>
              <Text style={{
                fontSize: 13,
                fontFamily: "Quicksand",
                color: tab === 2 ? "#FFFFFF" : "rgba(0,149,218,1)"
              }}>acceptați</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: tab === 3 ? "rgba(0,149,218,1)" : "#FFFFFF",
              padding: 6,
              borderWidth: 1,
              borderColor: "rgba(0,149,218,1)",
              borderBottomRightRadius: 5,
              borderTopRightRadius: 5
            }}
              onPress={() => {
                setTab(3);
              }}>
              <Text style={{
                fontSize: 13,
                fontFamily: "Quicksand",
                color: tab === 3 ? "#FFFFFF" : "rgba(0,149,218,1)"
              }}>refuzați</Text>
            </TouchableOpacity>
          </View>
        </View>

        {tab === 1 ? <FlatList data={volunteers} renderItem={renderItem2} keyExtractor={(item) => item.name} /> : null}
        {tab === 2 ? <FlatList data={accepted} renderItem={renderItem2} keyExtractor={(item) => item.name} /> : null}
        {tab === 3 ? <FlatList data={refused} renderItem={renderItem2} keyExtractor={(item) => item.name} /> : null}


      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
        <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'grey', bottom: 0, marginTop: 'auto' }} />
        <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Știri despre "voluntar"</Text>
      </View>
      <Text style={styles.loremIpsum1}>
        Derulează pentru mai multe articole.
      </Text>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
      <View style={styles.footerContainer}>
        <MaterialBasicFooter1
          style={styles.materialBasicFooter1}
        ></MaterialBasicFooter1>
      </View>
    </View>);
  }
  else return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/fabrica_de_voluntari.png")}
        resizeMode="contain"
        style={styles.image1}
      ></Image>
      <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: "40%" }}>
        <View style={{ width: 125, height: 3, backgroundColor: 'rgba(0,149,218,1)', marginBottom: 25 }} />
        <Text style={styles.textW}>Bine ai venit,</Text>
        <Text style={styles.textW}>completează-ți profilul</Text>
        <Text style={styles.textW}>pentru a debloca aplicația.</Text>
        <View style={{ width: 125, height: 3, backgroundColor: 'rgba(0,149,218,1)', marginTop: 30 }} />
      </View>
      <View style={styles.footerContainer}>
        <MaterialBasicFooter1
          style={styles.materialBasicFooter1}
        ></MaterialBasicFooter1>
      </View>
    </View>
  );
}



const stylesTab = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  textWrapper: {
    height: 29,
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row"
  }
});


const stylesList = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10
  },
  title: {
    fontSize: 15,
    width: Dimensions.get('window').width * 7 / 10,
    fontFamily: 'Quicksand',
  },
  text: {
    fontSize: 10,
    fontFamily: 'Quicksand'
  }
});


const styles = StyleSheet.create({
  textW: {
    textAlign: 'center',
    fontFamily: "Quicksand",
    fontSize: 25,
    color: "black"
  },
  container: {
    flex: 1,
    alignItems: "center"
  },
  image1: {
    width: 100,
    height: 100,
    marginTop: 48,
    alignSelf: "center"
  },
  materialBasicFooter1: {
    height: 56,
    width: Dimensions.get('window').width,
  },
  loremIpsum1: {
    fontFamily: "Quicksand",
    color: "rgba(96,93,93,1)",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 10,
  },
  footerContainer: {
    marginTop: 'auto',
    bottom: 0
  },
});

const stylesItemm = StyleSheet.create({
  icon3: {
    color: "white",
    fontSize: 25,
  },
  touch: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 7,
    marginLeft: 10
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    width: Dimensions.get('window').width * 8 / 10,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Quicksand',
    width: 225
  },
  text: {
    fontSize: 10,
    fontFamily: 'Quicksand',
  }
});

export default HomeScreen;
