import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../Components/api";
import { useNavigation } from '@react-navigation/native';

export default function useFetch(query) {
    const storageKey = 'userData';
    const navigation = useNavigation(); 
  
    const [getData, setData] = useState({
      isLoading: false,
      apiData: undefined,
      status: null,
      serverError: null,
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setData((prev) => ({ ...prev, isLoading: true }));
  
          const storedData = await AsyncStorage.getItem(storageKey);
  
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setData((prev) => ({ ...prev, apiData: parsedData, isLoading: false }));
            return;
          }
  
          const username = !query ? (await getUsername()).username : '';
     
          const { data, status } = !query
            ? await api.get(`/user/${username}`)
            : null;
  
          // Use navigation to navigate to 'HomeTabs' screen
          if (navigation) {
            navigation.navigate('HomeTabs');
          }
          await AsyncStorage.setItem(storageKey, JSON.stringify(data));
          setData((prev) => ({ ...prev, apiData: data, status, isLoading: false }));
        } catch (error) {
          console.error('An error occurred during data fetch:', error);
          setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
        }
      };
  
      fetchData();
    }, [query, storageKey, navigation]);
  
   const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };
  
    return [getData, setData, clearAsyncStorage];
  }