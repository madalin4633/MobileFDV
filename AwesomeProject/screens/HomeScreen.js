import React, { Component, useContext, useState, useEffect, useRef } from "react";
import { StyleSheet,RefreshControl, ScrollView, View, Image, Dimensions, TouchableOpacity, Linking, FlatList, Text, Alert } from "react-native";
import MaterialBasicFooter1 from "../components/MaterialBasicFooter1";
import { useFonts } from 'expo-font';
import { AuthContext } from '../AuthProvider';
import { useNavigation } from '@react-navigation/native';
import firebase from '../database/firebaseDb';
import LoadingScreen from './LoadingScreen';
import EntypoIcon from "react-native-vector-icons/Entypo";
import styled from 'styled-components/native';
import CircularProgress from '../components/CircularProgress';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

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
  const [level, setLevel] = useState({});

  const [refreshing, setRefreshing] = React.useState(false);

  const isMounted = useRef(null);

  const [loaded] = useFonts({
    Quicksand: require('../assets/fonts/quicksand-700.ttf'),
  });

  const getArticles = async () => {
    fetch('https://newsapi.org/v2/everything?q=voluntar&apiKey=e2e652c4424d404c9b139351e49602e4') //4dbc17e007ab436fb66416009dfb59a8
      .then(response => response.json())
      .then(data => setArticles(data.articles));
  }

  if (articles === '')
    getArticles();

  const getVolunteersPending = async () => {
    var database2 = firebase.database();
    database2.ref('/ngos/' + user.uid.toString() + "/pending/").on('value', function (snapshot) {
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

  const getXP = async () => {
    var database2 = firebase.database();
    let level = {};
    //in cate asociatii este
    var ngosNo = 0;
    database2.ref('/ngos/').on('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        ngosNo += childSnapshot.child("accepted/" + user.uid).numChildren();
      });
      level['ngos_number'] = ngosNo;
    });

    //vechimea in zile
    database2.ref('/volunteers/' + user.uid).on('value', function (snapshot) {
      let enter_date = new Date(snapshot.val().created_at);
      let now_date = new Date();
      var Difference_In_Time = now_date.getTime() - enter_date.getTime();
      level['days'] = (Difference_In_Time / (1000 * 3600 * 24)).toFixed(3);
    });

    //cate recompense are si ore a lucrat
    var rewards = 0;
    var hours = 0;
    database2.ref('/rewards/').on('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var redeems = childSnapshot.child("redeemed_by");
        redeems.forEach(function (grandChild) {
          var grandData = grandChild.val();
          if (grandData.user === user.uid) {
            rewards = rewards + 1;
            hours = hours + childSnapshot.val().hours;
          }
        });
      });
      level['rewards'] = rewards;
      level['hours'] = hours;
    });

    let player_xp = (ngosNo + rewards + hours) * 16 + level['days'] * 0.5;

    for (let step = 1; step < 12; step++) {
      if (player_xp < 4 ** step) {
        level['level'] = step;
        level['percentage'] = Math.round(100 * (player_xp - 4 ** (step - 1)) / (4 ** step - 4 ** (step - 1)));
        break;
      }
    }
    setLevel(level);
  }

  const getVolunteersAccepted = async () => {
    var database2 = firebase.database();
    database2.ref('/ngos/' + user.uid.toString() + "/accepted/").on('value', function (snapshot) {
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
    database2.ref('/ngos/' + user.uid.toString() + "/refused/").on('value', function (snapshot) {
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
  if (type === '') {
    var database = firebase.database();
    database.ref("/accounts/" + user.uid).on('value', function (snapshot) {
      var childData = snapshot.val();
      setType(childData.type);
      setEdit(childData.edited);
    });
  }
  useEffect(() => {
    isMounted.current = true;
    if (type === 0 && edit === 1)
      getXP();
    getVolunteersPending();


    return () => {
      // executed when unmount
      isMounted.current = false;
    }
  }, []);


  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <View style={stylesList.container}>
      <TouchableOpacity style={[stylesList.item, backgroundColor]} onPress={onPress}>
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
          try {
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
          } catch (e) { }
        }}>
          <EntypoIcon name="check" style={stylesItemm.icon3}></EntypoIcon>
        </TouchableOpacity>
        <TouchableOpacity style={stylesItemm.touch} onPress={() => {
          try {
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
          } catch (e) { }
        }}>
          <EntypoIcon name="cross" style={stylesItemm.icon3}></EntypoIcon>
        </TouchableOpacity>
      </View>
    </View>
  );


  const Itemmm = ({ item, onPress, backgroundColor, textColor }) => (
    <View style={stylesItemm.container}>
      <View onPress={onPress} style={[stylesItemm.item, backgroundColor]}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Quicksand',
          width: 225, color: "white",
        }}>{item.name}</Text>
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getXP();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  if (!loaded) {
    return <LoadingScreen />
  }
  else
    if (edit === 1) {
      if (type === 0)
        return (
          <View style={styles.container}>
            <EntypoIcon name="info-with-circle" style={styles.icon3}
            onPress={ () => navigation.navigate('HomeInfo', { type: type })}></EntypoIcon>
            <Image
              source={require("../assets/images/fabrica_de_voluntari.png")}
              resizeMode="contain"
              style={styles.image1}
            ></Image>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
              <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
              <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Nivelul tău</Text>
            </View>
            <Text style={styles.loremIpsum1}>
              În baza activității din toate organizațiile.
            </Text>

            <ScrollView
              contentContainerStyle={{ height: 245 }} refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }>
              <Container><CircularProgress progress={level['percentage']} size={175} nivel={level['level']} /></Container>
              <TouchableOpacity
                style={[styless.container, props.style]}>
                <Text style={styless.deconnect}
                  onPress={() => { navigation.navigate('BadgesScreen', { stats: level }) }}>
                  Vezi insignele tale</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
              <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
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
      else {
        return (<View style={styles.container}>
          <EntypoIcon name="info-with-circle" style={styles.icon3} 
          onPress={ () => navigation.navigate('HomeInfo', { type: type })}/>
          <Image
            source={require("../assets/images/fabrica_de_voluntari.png")}
            resizeMode="contain"
            style={styles.image1}
          ></Image>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>
            <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
            <Text style={{ width: Dimensions.get('window').width * 7 / 15, borderBottomColor: "black", borderBottomWidth: 3, textAlign: 'center', fontFamily: "Quicksand", fontSize: 15, color: "black", paddingBottom: 5 }}>Voluntarii tăi</Text>
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
                    getVolunteersAccepted();
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
                    getVolunteersRefused();
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
            <View style={{ width: Dimensions.get('window').width * 8 / 15, height: 3, backgroundColor: 'rgb(220,220,220)', bottom: 0, marginTop: 'auto' }} />
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
    marginTop: 33,
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
  icon3: {
    flex: 0,
    position: "absolute",
    color: "rgba(0,149,218,1)",
    fontSize: 25,
    marginRight: "10%",
    marginTop: 50,
    alignSelf: 'flex-end',
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

const styless = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,149,218,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 10,
    marginTop: 12
  },
  deconnect: {
    color: "#fff",
    fontSize: 22,
    fontFamily: 'Quicksand'
  },
});

export default HomeScreen;
