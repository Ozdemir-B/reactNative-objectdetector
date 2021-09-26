import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import FormData from 'react-native/Libraries/Network/FormData';




export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  
  var uid;
  var newUri;

  function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  function done(){
    Alert.alert("file processed..");

    setImage({
      uri: "https://yazlab13.herokuapp.com/image/"+uid+".jpg"
    });

  }

  

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  


  const takePic = async () => {

    uid=getRandomString(10);

    let result2 = await ImagePicker.launchCameraAsync(
      //no parameters needed...
    )

    if (!result2.cancelled){
      setImage(result2.uri);
      console.log(result2.uri)
      //send

      var data = new FormData();
      var photo={
        uri:result2.uri,
        type:'image/jpeg',
        name:uid+'.jpg'
      }
      data.append("imagefile", photo);
          
      var xhr = new XMLHttpRequest();
      
      xhr.withCredentials = true;
          
      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          console.log(this.responseText);
        }
      });
      
      xhr.open("POST", "https://yazlab13.herokuapp.com/upload");
      
      xhr.send(data);
      //

      console.log(uid);
    }

    setTimeout(done,15000);
    

    

    //---
    
    //---

  }

  

  const pickImage = async () => {

    uid=getRandomString(10);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      console.log(result.uri);

      //---
      //send

      var data = new FormData();
      var photo={
        uri:result.uri,
        type:'image/jpeg',
        name:uid+'.jpg'
      }
      data.append("imagefile", photo);
          
      var xhr = new XMLHttpRequest();
      
      xhr.withCredentials = true;
          
      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          console.log(this.responseText);
        }
      });
      
      xhr.open("POST", "https://yazlab13.herokuapp.com/upload");
      
      xhr.send(data);
      //---
      console.log(uid);

      setTimeout(done,15000);

      

      

    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' , backgroundColor:"gray"}}>

      {image && <Image source={{uri:image.uri}}  style={{ width: 200, height: 200 }} />}

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      
      
      <Button title="Take a picture" onPress={takePic} />
      
      
    </View>
  );
}
