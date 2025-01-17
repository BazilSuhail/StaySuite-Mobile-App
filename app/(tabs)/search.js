import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import config from '@/Config/Config';
import { useAuthContext } from '@/hooks/AuthProvider';
import FilterModal from '@/components/FilterModal';

const Search = () => {
  const { login } = useAuthContext();
  const [focusField, setFocusField] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const handleChange = (name, value) => {
    //const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${config.BACKEND_URL}/air-bnb/auth/login`,
        formData
      );

    }
    catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handleFocus = (field) => {
    setFocusField(field);
  };

  const handleBlur = () => {
    setFocusField('');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b91c1c" />
        <Text style={styles.loadingText}>Signing In...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FilterModal/>
      <View style={styles.logoContainer}>

        <Text style={styles.logoText}>
          Air<Text style={styles.logoTextHighlight}>BnB</Text>
        </Text>
      </View>

      <Text style={styles.tagline}>Stay, Host, Explore !! Your Next Adventure Starts Here.</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="envelope" size={20} color="#fff" />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, focusField === 'email' || email ? styles.labelActive : null]}>
              Email
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(value) => handleChange('email', value)}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder=""
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="lock" size={20} color="#fff" />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, focusField === 'password' || password ? styles.labelActive : null]}>
              Password
            </Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(value) => handleChange('password', value)}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              secureTextEntry
              placeholder=""
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 34,
    height: 31,
    marginRight: 8,
  },
  logoText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  logoTextHighlight: {
    color: '#ef4444',
  },
  tagline: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: '#b91c1c',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 0,
    top: 12,
    fontSize: 16,
    color: '#4b5563',
    transition: 'top 0.3s, font-size 0.3s',
  },
  labelActive: {
    top: -8,
    fontSize: 12,
    color: '#4b5563',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#b91c1c',
    paddingVertical: 8,
    fontSize: 16,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#b91c1c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  signupText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
  signupLink: {
    color: '#b91c1c',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#b91c1c',
  },
});

export default Search;
