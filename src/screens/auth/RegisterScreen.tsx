import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { supabase } from '../../lib/supabase';

export const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = {
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      return supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'customer' // Default role for new users
          }
        }
      });
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { error } = await auth.createUserWithEmailAndPassword(email, password);
      
      if (error) throw error;
      
      Alert.alert('Success', 'Registration successful! Please login.');
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Create Account</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Register"
        onPress={handleRegister}
        loading={loading}
        containerStyle={styles.button}
      />
      <Button
        title="Back to Login"
        type="clear"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
});