import React, {useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableHighlight,
  TextInput,
} from 'react-native';

const TodosItem = props => {
  const [itemDisplay, setitemDisplay] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(Boolean(false));
  const [itemDate, setItemDate] = useState({});
  const [staging, setStaging] = useState();

  // let staging;

  //   伸展动画
  const onPressEdit = () => {

    Animated.timing(
      // 随时间变化而执行动画
      fadeAnim, // 动画中的变量值
      {
        toValue: 109, // 透明度最终变为1，即完全不透明
        duration: 300, // 让动画持续一段时间
        useNativeDriver: false,
      },
    ).start();
    setitemDisplay(0);
  };
  // 回缩动画
  function onEndEdit(propsSelf, itemDate) {
    // props参数 1为完成该任务，0为编辑该任务，2为删除该任务
    // console.error(Event)
    if (propsSelf == 0) {
      setItemDate(itemDate);
      setModalVisible(!modalVisible);
    }
    Animated.timing(
      // 随时间变化而执行动画
      fadeAnim, // 动画中的变量值
      {
        toValue: 0, // 透明度最终变为1，即完全不透明
        duration: 300,
        useNativeDriver: false,
      },
    ).start();
    setitemDisplay(1);
  }
  // 对象赋值
  function onObjecctEdit() {
    let stagObject = itemDate;

    stagObject.text = staging;

    return stagObject;
  }

  const EditButtonGroup = () => {
    if (itemDisplay == 0) {
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 242,
          }}
          >
          {/* 完成任务按钮 */}
          <TouchableOpacity
            onPress={() => {
              props.onHandleDB(props.content, 1);
              onEndEdit();
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../static/complete.png')}
              style={todosItemStyle.imageButton}
            />
            <Text style={{color: '#FFFFFF', fontSize: 12, fontWeight: 'bold'}}>
              finish
            </Text>
          </TouchableOpacity>
          {/* 编辑任务按钮 */}
          <TouchableOpacity
            onPress={() => {
              props.onHandleDB(props.content, 0);
              onEndEdit(0, props.content);
            }}>
            <Image
              source={require('../../static/edit.png')}
              style={todosItemStyle.imageButton}
            />
            <Text style={{color: '#FFFFFF', fontSize: 12, fontWeight: 'bold'}}>
              deit
            </Text>
          </TouchableOpacity>
          {/* 删除任务按钮 */}
          <TouchableOpacity
            onPress={() => {
              props.onHandleDB(props.content, 2);
              onEndEdit(2);
            }}>
            <Image
              source={require('../../static/delete.png')}
              style={todosItemStyle.imageButton}
            />
            <Text style={{color: '#FFFFFF', fontSize: 12, fontWeight: 'bold'}}>
              delete
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      <View></View>;
    }
  };

  return (
    <View
      style={[
        todosItemStyle.itemContainer,
        props.content.status != '1' && props.content.status != '2'
          ? {display: 'none'}
          : {},
      ]}
      key={props.content.id}>
      <View
        style={
          props.content.status == '2'
            ? todosItemStyle.completeItem
            : todosItemStyle.activeItem
        }></View>
      <View style={todosItemStyle.contentItem}>
        <View style={todosItemStyle.ItemText}>
          <Text
            style={
              props.content.status == '2'
                ? todosItemStyle.completeText
                : todosItemStyle.activeText
            }>
            {props.content.status == '2' ? 'finished' : 'in progress'}
          </Text>
          <Text style={todosItemStyle.itemTextStyle}>{props.content.text}</Text>
          <Text style={todosItemStyle.timeStyle}>{props.content.time}</Text>
        </View>
        <View style={todosItemStyle.ItemButton}>
          <TouchableOpacity onPress={
            onPressEdit
            }>
            <Image
              source={require('../../static/edit.png')}
              style={todosItemStyle.imageButton}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View
        style={[
          {height: fadeAnim, opacity: fadeAnim},
          todosItemStyle.contentShadow,
          props.content.status == '2'
            ? {backgroundColor: '#D04230'}
            : {backgroundColor: '#50E3C2'},
        ]} 
        
        onPress={() => {
          console.warn('back')
          onEndEdit;
        }}>
        <EditButtonGroup></EditButtonGroup>
      </Animated.View>

      <View style={todosItemStyle.centeredView}>
        <Modal
          animationType={'none'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}>
          <View style={todosItemStyle.centeredView}>
            <View style={todosItemStyle.modalView}>
              <View style={todosItemStyle.modalInput}>
                <View>
                  <Text style={[staging != '' ? {display:'none'} : {}, {fontSize: 16, color:'#D04230'}]}>The change name cannot be empty</Text>
                  <Text style={[ staging == '' ? {display:'none'} : {} ,{fontSize: 16}]}>
                  Please modify the task &nbsp;
                    <Text
                      style={[
                        itemDate.status == 1
                          ? {color: '#50E3C2'}
                          : {color: '#D04230'},
                        {fontWeight: 'bold'},
                      ]}>
                      {'（' + itemDate.text + '）'}
                    </Text>
                    &nbsp;name：
                  </Text>
                </View>
                <TextInput
                  placeholder={'Please enter the name you want to change'}
                  value={staging}
                  onChangeText={text => {
                    setStaging(text);
                  }}></TextInput>
              </View>

              <View style={todosItemStyle.modalButtonGroup}>
                <TouchableHighlight
                  style={{
                    ...todosItemStyle.openButton,
                    backgroundColor: '#2196F3',
                  }}
                  onPress={() => {
                    if(staging == ''){
                      return
                    }
                    let stagObject = onObjecctEdit();
                    props.onHandleDB(stagObject, 0);
                    setStaging('');
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={todosItemStyle.textStyle}>submit</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={{
                    ...todosItemStyle.openButton,
                    backgroundColor: '#2196F3',
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={todosItemStyle.textStyle}>cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const todosItemStyle = StyleSheet.create({
  itemContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 109,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#D8D8D8',
    paddingRight: 30,
    position: 'relative',
  },
  activeItem: {
    width: 10,
    marginRight: 32,
    backgroundColor: '#50E3C2',
  },
  completeItem: {
    width: 10,
    marginRight: 32,
    backgroundColor: '#D04230',
  },
  //   单项主体内容样式
  contentItem: {
    width: 290,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 18,
    position: 'relative',
    // zIndex: 0,
    overflow: 'visible',
  },
  //   单项覆盖按钮样式
  contentShadow: {
    // height: "100%",
    width: '110%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  imageButton: {
    width: 24,
    height: 24,
  },
  ItemButton: {
    width: 24,
    height: 24,
  },
  activeText: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#50E3C2',
  },
  completeText: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#D04230',
  },
  itemTextStyle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#4A4956',
  },
  timeStyle: {
    fontSize: 12,
    color: '#787786',
  },
  animatedView: {
    backgroundColor: 'blue',
    padding: 20,
    alignItems: 'center',
  },
  itemDisplay: {
    display: 'none',
  },
  itemDisFlex: {
    display: 'flex',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.2)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingBottom: 15,
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 80,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtonGroup: {
    width: 190,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TodosItem;
