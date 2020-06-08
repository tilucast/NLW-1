import React, {useState, useEffect} from 'react'
import {View, ImageBackground, Image , Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform} from 'react-native'
import {Feather as Icon} from '@expo/vector-icons'
import {RectButton} from 'react-native-gesture-handler'
import {useNavigation} from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'

import axios from 'axios'
import Picker from 'react-native-picker-select'


interface IBGEUFResponse {
  sigla: string
}

interface IBGECITYResponse {
  nome: string
}

interface Label {
  label: string,
  value: string
}

const Home = () =>{
    const [uf, setUf] = useState('')
    const [city, setCity] = useState('')

    const [ufInitials, setUfInitials] = useState<string[]>([])
    const [cities, setCities] = useState<Label[]>([])

    const [labeledUf, setLabeledUf] = useState<Label[]>([])

    const navigation = useNavigation()

    function handleNavigatePoints(){
      navigation.navigate('Points', {
        uf,
        city
      })
    }

    useEffect(() =>{
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
          const ufResponse = res.data.map(uf => uf.sigla)

          setUfInitials(ufResponse)
        })
    }, [])

    useEffect(() =>{
        if(uf === '')
          return

        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(res =>{
            const citiesResponse = res.data.map(city => city.nome)

            const citiesLabeled = citiesResponse.map(city => {
              return { label: city, value: city }
            })

            setCities(citiesLabeled)
        })
    }, [uf])

    useEffect(() =>{
      const labeled = ufInitials.map(uf => {
        return { label: uf, value: uf }
      })

      setLabeledUf(labeled)

    }, [ufInitials]) 

    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground 
          source={require('../../assets/home-background.png')} 
          style={styles.container}
          imageStyle={{ width: 274, height: 368 }}
          >
                <View style={styles.main}>
                  
                    <Image source={require('../../assets/logo.png')}/>

                    <View>
                      <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                      <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>

                </View>

                <View style={styles.footer}>

                  <RNPickerSelect 
                      useNativeAndroidPickerStyle={false}
                      style={pickerSelectStyles}
                      placeholder={{label: 'Selecione uma UF', color: 'gray'}}
                      onValueChange={value => setUf(value)}
                      value={uf}
                      items={labeledUf}
                  />

                  <RNPickerSelect
                      useNativeAndroidPickerStyle={false}
                      style={pickerSelectStyles}
                      placeholder={{label: 'Selecione uma cidade', color: 'gray'}}
                      onValueChange={value => setCity(value)}
                      value={city}
                      items={cities}
                  />

                  <RectButton style={styles.button} onPress={handleNavigatePoints}>

                    <View style={styles.buttonIcon}>
                      <Text> <Icon name="arrow-right" color="#fff" size={24}/> </Text>
                    </View>

                    <Text style={styles.buttonText}>Entrar</Text>

                  </RectButton>

                </View>

        </ImageBackground>
      </KeyboardAvoidingView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
})

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#350056',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 80,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home