import {getTodosList, addTodosList, deleteTodosItem} from './api';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import TodosItem from './common/todoItem';
import DeviceInfo from 'react-native-device-info';
import Contacts from 'react-native-contacts';

const TodoList = () => {
  const [data, setData] = useState();
  const [pagemark, setPageMark] = useState(0);
  const [modalVisible, setModalVisible] = useState(Boolean(false));
  const [modalText, setModalText] = useState('');
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  async function addFuc(todoAdd: any) {
    await addTodosList(todoAdd);
    init(pagemark);
  }

  async function init(sync: any) {
    let todolist;
    let urlsuffix;

    if (sync == 0) {
      // 获取全部数据
      urlsuffix = 'all';
    } else if (sync == 1) {
      // 获取正在进行数据
      urlsuffix = 'active';
    } else if (sync == 2) {
      // 获取已完成数据
      urlsuffix = 'complete';
    }

    todolist = await getTodosList(urlsuffix);
    setData(todolist);
    todolist = {};
  }
  //  从后端获取数据并赋值给data
  useEffect(() => {
    init(0);
  }, []);

  const getDeviceInfo = async () => {
    let deviceId = DeviceInfo.getDeviceId();
    let deviceAPILevel;
    let deviceBaseOS = DeviceInfo.getSystemName();
    let deviceBaseName;
    let deviceIPAddress;
    let devicePowerState;
    await DeviceInfo.getApiLevel().then(apiLevel => {
      deviceAPILevel = apiLevel;
    });
    await DeviceInfo.getDeviceName().then(deviceName => {
      deviceBaseName = deviceName;
    });
    await DeviceInfo.getIpAddress().then(ip => {
      deviceIPAddress = ip;
    });
    await DeviceInfo.getPowerState().then(state => {
      devicePowerState = state;
    });
    ToastAndroid.showWithGravity(
      JSON.stringify({
        PhoneID: deviceId,
        PhoneAPI: deviceAPILevel,
        PhoneSystem: deviceBaseOS,
        PhoneName: deviceBaseName,
        PhoneIP: deviceIPAddress,
        PhonePower: devicePowerState,
      }).toString(),
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

  const renderItem = ({item}: any) => {
    async function deleteFuc(todoToDelete: any) {
      await deleteTodosItem(todoToDelete);
      init(pagemark);
    }

    function onHandleDB(date: any, sync: any) {
      if (sync == 1) {
        if (date.status == '2') {
          Alert.alert('This task is complete and no operation is required');

          return;
        }
        let sendDate = date;
        sendDate.status = '2';
        deleteFuc(sendDate);
      } else if (sync == 2) {
        let sendDate = date;
        sendDate.status = '0' + date.status;
        deleteFuc(sendDate);
      } else {
        let sendDate = date;
        deleteFuc(sendDate);
        // modle(true);
      }
    }

    return (
      <TodosItem
        key={item.id}
        onHandleDB={onHandleDB}
        content={item}></TodosItem>
    );
  };

  return (
    <View
      style={{
        position: 'relative',
        paddingBottom: 40,
        height: '100%',
        backgroundColor: 'white',
      }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id} // 提供一个keyExtractor函数
      />
      <View style={appStyles.bottomBar}>
        <View style={appStyles.bottomBarButtonGroup}>
          {/* 全部，底部切换按钮 */}
          <TouchableOpacity
            style={appStyles.bottomBarButtonAll}
            onPress={() => {
              init(0);
              setPageMark(0);
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {'ALL'}
            </Text>
          </TouchableOpacity>

          {/* 已完成，底部切换按钮 */}
          <TouchableOpacity
            style={appStyles.bottomBarButtonComplete}
            onPress={() => {
              init(2);
              setPageMark(2);
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {'FINISHED'}
            </Text>
          </TouchableOpacity>

          {/* 正在进行，底部切换按钮 */}
          <TouchableOpacity
            style={appStyles.bottomBarButtonActive}
            onPress={() => {
              init(1);
              setPageMark(1);
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {'NETSTAT'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* 底部侧边添加数据按钮 */}
        <View style={appStyles.addButton}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Image
              style={{height: 40, width: 40}}
              source={require('../static/add.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType={'none'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={appStyles.centeredView}>
          <View style={appStyles.modalView}>
            <View>
              <View>
                <Text style={{fontSize: 16, color: '#B8E986'}}>
                Please fill in the task name
                </Text>
              </View>
              <TextInput
                placeholder={'Please fill in the task name'}
                value={modalText}
                onChangeText={text => {
                  setModalText(text);
                }}></TextInput>
            </View>

            <View style={appStyles.modalButtonGroup}>
              <TouchableHighlight
                style={{
                  ...appStyles.openButton,
                  backgroundColor: '#B8E986',
                }}
                onPress={() => {
                  if (modalText == '') {
                    Alert.alert('The task name cannot be empty');
                    return;
                  }
                  let data = {
                    text: modalText,
                    status: '1',
                    time: '2024-03-26',
                  };
                  addFuc(data);
                  setModalVisible(!modalVisible);
                  setModalText('');
                }}>
                <Text style={appStyles.textStyle}>submit</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  ...appStyles.openButton,
                  backgroundColor: '#B8E986',
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={appStyles.textStyle}>cancel</Text>
              </TouchableHighlight>
            </View>

            <View style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                width: 260,
              }
            }>
              <TouchableHighlight
                style={{
                  width: 120,
                  height: 40,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#B8E986',
                }}
                onPress={() => {
                  getDeviceInfo();
                }}>
                <Text style={appStyles.textStyle}>Obtain the current device information</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  width: 120,
                  height: 40,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#B8E986',
                }}
                onPress={() => {
                  PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
                  )
                    .then(res => {
                      console.log('Permission: ', res);
                      Contacts.getAll()
                        .then(contacts => {
                          ToastAndroid.showWithGravity(
                            "The Contact number is"+ contacts.length,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                          );
                        })
                        .catch(e => {
                          console.log(e);
                        });
                    })
                    .catch(error => {
                      console.error('Permission error: ', error);
                    });
                }}>
                <Text style={appStyles.textStyle}>Contacts number</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const appStyles = StyleSheet.create({
  bottomBar: {
    backgroundColor: 'white',
    position: 'absolute',
    height: 40,
    width: '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBarButtonGroup: {
    flex: 1,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBarButtonAll: {
    height: 40,
    flex: 1,
    backgroundColor: '#4885ED',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarButtonComplete: {
    height: 40,
    flex: 2,
    backgroundColor: '#D04230',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarButtonActive: {
    height: 40,
    flex: 2,
    backgroundColor: '#50E3C2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    height: 40,
    width: 40,
    backgroundColor: '#B8E986',
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
    color: 'black',
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

export default TodoList;
