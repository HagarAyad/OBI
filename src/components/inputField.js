import React from 'react';
import {View, TextInput, Text, StyleSheet,I18nManager} from 'react-native';
import {colors} from '../utils/appTheme';

export default function InputField({
  fieldName,
  fieldDisplayName,
  fieldValue,
  onFieldValueChange,
  isNumericInput,
  isRequired,
}) {

  const onInputValueChange=(val)=>{
      let isFieldValid = true;
      if(val && isNumericInput){
        const reg = /^[0-9]+$/;
         isFieldValid = reg.test(val);
      }
      isFieldValid &&  onFieldValueChange(val, fieldName)
  }

  return (
    <View style={styles.inputContainer}>
      <Text>
           <Text>{fieldDisplayName[I18nManager.isRTL?'ar':'en']}</Text>
           {isRequired && (<Text style={{color:'red'}}>{`  *`}</Text>)}
      </Text>
    
      <TextInput
        style={styles.input}
        value={fieldValue}
        onChangeText={onInputValueChange}
        keyboardType={isNumericInput ? 'numeric' : 'default'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding:8,
    marginVertical: 5,
    backgroundColor: colors.white,
  },
  input: {
    marginTop:0,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
  },
});
