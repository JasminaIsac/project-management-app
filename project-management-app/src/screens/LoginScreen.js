import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import logo from '../../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth(); // Folosește login-ul din AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateFields = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };

    // Validare email
    if (!email.trim()) {
      newErrors.email = 'Email cannot be empty';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Validare password
    if (!password.trim()) {
      newErrors.password = 'Password cannot be empty';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return; // Nu continua dacă validarea nu trece

    try {
      await login(email, password); // Autentifică utilizatorul
    } catch (error) {
      // Setează eroare la autentificare
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Incorrect email or password',
      }));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </TouchableOpacity>
      <Text style={styles.title}>Login</Text>
      {/* Input pentru email */}
      <TextInput
        style={[
          styles.input,
          errors.email ? styles.errorBorder : null, // Bordura roșie dacă există eroare
        ]}
        placeholder="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setErrors((prevErrors) => ({ ...prevErrors, email: '' })); // Resetează eroarea
        }}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      {/* Input pentru password */}
      <TextInput
        style={[
          styles.input,
          errors.password ? styles.errorBorder : null, // Bordura roșie dacă există eroare
        ]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrors((prevErrors) => ({ ...prevErrors, password: '' })); // Resetează eroarea
        }}
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default LoginScreen;
