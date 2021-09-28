import React ,{useEffect,useState,useLayoutEffect}from 'react'
import {ActivityIndicator,StyleSheet,View,Button,Modal,Text,I18nManager} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import ChoiceList from '../components/choiceList'
import InputField from '../components/inputField'
import app_endpoints from '../services/appEndpoints'
import {colors} from '../utils/appTheme'

export default function Register() {

    const navigation=useNavigation()
    const [formFields,setFormFields]=useState({data:[],loading:true,hasError:false})
    const [formValues,setFormValues]=useState({})
    const [isFormValid,setIsFormValid]=useState(false)
    const [isSuccessModalVisible,setIsSuccessModalVisible]=useState(false)

    const getInitialFormValues=({fields})=>{
        let initial_values={}
        fields.map(fieldItem=>{
            const {text}=fieldItem
            initial_values={
                ...initial_values,
                [text['en']]:''
            }
        })
        return initial_values
    }

    const loadData=async()=>{
        try{
            const {data={}}=await app_endpoints.index()
            const {fields}=data           
            // console.log('form-fields',fields)
            const initial_values=getInitialFormValues({fields})
            setFormValues(initial_values)
            setFormFields({
                data:fields,
                loading:false,
                hasError:false
            })

        }
        catch(e){
            console.log('fetch failed',e.response)
            setFormFields({
                data:[],
                loading:false,
                hasError:true
            })
        }
    }

    const onSubmit = () => {
      if (isFormValid) setIsSuccessModalVisible(true);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: 'Farmer',
          headerTitleStyle: {color: colors.white},
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.blue,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor:'transparent'
          },
          headerRight: () => (
            <Text
              onPress={onSubmit}
              style={isFormValid ? styles.submitBtn : styles.submitDisabled}>
              Submit
            </Text>
          ),
        });
    }, [navigation,isFormValid]);

    useEffect(()=>{      
        loadData()
    },[])

    useEffect(() => {
      if (formFields.data.length > 0) {
        const isFormValid_val = formFields.data.every(item => {
          const {attributes: {required: isRequired} = {}, type, text} = item;
          let isNumericField = type === 'numaric';

          let field_name = text.en;
          let field_val = formValues[field_name];

          let isFieldValid = true;
          if (isRequired) {
            isFieldValid = formValues[field_name]?.trim() != '';
          }
          if (isNumericField) {
            const reg = /^[0-9]+$/;
            isFieldValid = reg.test(field_val);
          }

          return isFieldValid;
        });
        setIsFormValid(isFormValid_val);
      }
    }, [formValues]);

    const setFormFieldValue=(val,field_name)=>{
        setFormValues({...formValues, [field_name]: val})
    }

    const _renderForm = () => {
      return formFields.data.map(item => {
        const {attributes:{required:isRequired}={},type, text} = item;
        let field_name = text.en;

        if (type === 'input-text' || type === 'numaric')
          return (
            <InputField
              key={field_name}
              fieldName={field_name}
              fieldDisplayName={text}
              fieldValue={formValues[field_name]}
              onFieldValueChange={setFormFieldValue}
              isNumericInput={type == 'numaric'}
              isRequired={isRequired}
            />
          );
        else if (type === 'single-choice') {
          const {options} = item;
          return (
            <ChoiceList
              key={field_name}
              data={options}
              choicesName={field_name}
              choicesDisplayName={text}
              selectedValue={formValues[field_name]}
              onSelectValue={setFormFieldValue}
              isRequired={isRequired}
            />
          );
        }
      });
    };

    const _renderSuccessModal = () => {
        return (
            <Modal
                visible={isSuccessModalVisible}
                transparent={true}
                onRequestClose={() => setIsSuccessModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Succuss Submit</Text>
                        {formFields.data.map(item => {
                            const { type, text } = item;
                            let field_name = text.en;
                            let field_display_name = text[I18nManager.isRTL ? 'ar' : 'en']
                            let field_value = formValues[field_name]
                            if (type == 'single-choice') {
                                const { options } = item
                                let selected_option = options?.find(op => op.value == field_value)
                                field_value = selected_option?.text[I18nManager.isRTL ? 'ar' : 'en']
                            }
                            return (
                                <Text style={styles.txt} key={field_name}>{field_display_name}{` : `}{field_value}</Text>
                            )
                        })}
                        <Button
                            title="ok"
                            onPress={() => setIsSuccessModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
    

    if (formFields.loading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {_renderForm()}
          {_renderSuccessModal()}
        </View>
      );
    }
}

const styles=StyleSheet.create({
    centeredContainer:{
        flex:1,
        backgroundColor: colors.white,
        justifyContent:'center',
        alignItems:'center'
    },
    container:{
        flex:1,
        padding:20,
        backgroundColor: colors.blue,
    },
    modalContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    modalContent:{
        width:'75%',
        backgroundColor: colors.white,
        borderRadius:15,
        elevation:5,
        padding:15
    },
    txt:{
        marginVertical:5,
        fontSize:12
    },
    title:{
        textAlign:'center',
        fontSize:14
    },
    submitBtn:{
        color: colors.white,
        fontSize:16
    },
    submitDisabled:{
        color: colors.gray,
        fontSize:16,
        fontWeight:'bold'
    }
})