import React from 'react'
import {View,FlatList,Text,TouchableOpacity,StyleSheet,I18nManager} from 'react-native'
import {colors} from '../utils/appTheme'

export default function ChoiceList({
  choicesName,
  choicesDisplayName,
  data,
  selectedValue,
  onSelectValue,
  isRequired
}) {
  const _renderItem = ({item}) => {
    const choiceName = item.text[I18nManager.isRTL?'ar':'en'];
    const choiceValue = item.value;
    const isItemSelected = selectedValue == choiceValue;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onSelectValue(choiceValue, choicesName)}
        key={choiceValue.toString()}>
        <View style={styles.circle}>
          {isItemSelected && <View style={styles.filledCircle} />}
        </View>
        <Text style={styles.option}>{choiceName}</Text>
      </TouchableOpacity>
    );
  };

  const _renderHeader = () => {
    return (
      <Text>
        <Text>{choicesDisplayName[I18nManager.isRTL?'ar':'en']}</Text>
        {isRequired && <Text style={{color: 'red'}}>{`  *`}</Text>}
      </Text>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={_renderHeader}
      data={data}
      renderItem={_renderItem}
      contentContainerStyle={styles.container}
      keyExtractor={item => item.value}
    />
  );
}

const styles=StyleSheet.create({
    container:{
        backgroundColor: colors.white,
        padding:8,
        marginVertical:10
    },
    itemContainer:{
        flexDirection:'row',
        padding:5,
        marginVertical:5
    },
    circle:{
        height:20,
        width:20,
        borderRadius:10,
        borderColor:colors.gray,
        borderWidth:2,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center'
    },
    filledCircle:{
        height:12,
        width:12,
        borderRadius:6,
        backgroundColor: colors.blue,
    },
    option:{
        fontSize:14,
        color:colors.black,
        textAlign:'center'
    }
})