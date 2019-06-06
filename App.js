/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// import React, { Component } from 'react';
// import { Platform, StyleSheet, Text, View, Alert } from 'react-native';
// import firebase from 'react-native-firebase';
// import { AsyncStorage } from 'react-native';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });


// export default class App extends Component {

//   async componentDidMount() {
//     this.checkPermission();
//     this.createNotificationListeners(); 
  
//   }
//   componentWillUnmount() {
//     this.notificationListener();
//     this.notificationOpenedListener();

//   }
//   async createNotificationListeners() {
//     /*
//     * Triggered when a particular notification has been received in foreground
//     * */
//     this.notificationListener = firebase.notifications().onNotification((notification) => {
//         const { title, body } = notification;
//         this.showAlert(title, body);
//     });
  
//     /*
//     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
//     * */
//     this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
//         const { title, body } = notificationOpen.notification;
//         this.showAlert(title, body);
//     });
  
//     /*
//     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
//     * */
//     const notificationOpen = await firebase.notifications().getInitialNotification();
//     if (notificationOpen) {
//         const { title, body} = notificationOpen.notification;
//         this.showAlert(title, body);
//     }
//     /*
//     * Triggered for data only payload in foreground
//     * */
//     this.messageListener = firebase.messaging().onMessage((message) => {
//       //process data message
//       console.log(JSON.stringify(message));
//     });
//   }
//   showAlert(title, body) {
//     Alert.alert(
//       title, body,
//       [
//           { text: 'OK', onPress: () => console.log('OK Pressed') },
//       ],
//       { cancelable: false },
//     );
//   }

  
//     //1
//   async checkPermission() {
//     const enabled = await firebase.messaging().hasPermission();
//     if (enabled) {
//         this.getToken();
//     } else {
//         this.requestPermission();
//     }
//   }
  
//     //3
//   async getToken() {
//     let fcmToken = await AsyncStorage.getItem('fcmToken');
//     if (!fcmToken) {
//         fcmToken = await firebase.messaging().getToken();
//         if (fcmToken) {
//             // user has a device token
//             await AsyncStorage.setItem('fcmToken', fcmToken);
//             //console.log(fcmToken)
//         }
//     }
//   }
  
//     //2
//   async requestPermission() {
//     try {
//         await firebase.messaging().requestPermission();
//         // User has authorised
//         this.getToken();
//     } catch (error) {
//         // User has rejected permissions
//         console.log('permission rejected');
//     }
//   }


//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });


import React from 'react';
import { Button, View } from 'react-native';

import firebase from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    // GET TOKEN
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
         
          console.log('Token: ', fcmToken);
        } else {
         
        }
      });

   
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
         
          console.log('hasPermission', enabled)
        } else {
          
          firebase.messaging().requestPermission()
            .then(() => {
             
            })
            .catch(error => {
             
              console.log('requestPermission', error)
            });
        }
      });

   
    const channel = new firebase.notifications.Android.Channel('default', 'Default Channel', firebase.notifications.Android.Importance.Max);
    channel.setDescription('My default channel');
   
    firebase.notifications().android.createChannel(channel);

   
    this.messageListener = firebase.messaging().onMessage((message) => {
    
      console.log('onMessage', message);
    });

    
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
     
      console.log('onNotificationDisplayed', notification);
    });

    this.notificationListener = firebase.notifications().onNotification((notification) => {
    
      console.log('onNotification', notification);
      notification.android.setChannelId('default');
      notification.android.setLargeIcon();
      firebase.notifications().displayNotification(notification);
    });


    
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      
      const action = notificationOpen.action;
      console.log('onNotificationOpened - action', action);
     
      const notification = notificationOpen.notification;
      console.log('onNotificationOpened - notification', notification)
    });


   
    firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          
         
          const action = notificationOpen.action;
          console.log('getInitialNotification - action', action);
          
          const notification = notificationOpen.notification;
          console.log('getInitialNotification - notification', notification);
        }
      });

  }

  componentWillUnmount() {
    this.messageListener();
    this.notificationDisplayedListener();
    this.notificationListener();
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Local message" onPress={() => {

          const notification = new firebase.notifications.Notification();
          notification.setNotificationId('id_' + new Date().getTime().toString());
          notification.setTitle('My local notification title');
          notification.setSubtitle('My local notification subtitle');
          notification.setBody('My local notification body');
          notification.setData({
            _bigPicture: '',
          });
          notification.setSound('default');
          notification.android.setColor('red');
          notification.android.setAutoCancel(true);
          notification.android.setPriority(firebase.notifications.Android.Priority.Max);
          notification.android.setChannelId('default');
          notification.android.setSmallIcon('ic_launcher');
          notification.android.setLocalOnly(true);
          notification.android.setUsesChronometer(true);
          notification.android.setBigText('Show when notification is expanded');
          notification.android.setClickAction('VIEW');
          notification.android.setShowWhen(true);
          notification.android.setBigPicture('https://vignette.wikia.nocookie.net/youtubepoop/images/f/f7/5Pikachu.png/revision/latest?cb=20141108062013')
          

          firebase.notifications().displayNotification(notification);
        }} />

       
      </View>
    );
  }
}