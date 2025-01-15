import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  authDomain: process.env.EXPO_PUBLIC_SUPABASE_URL,
  projectId: "hotel-management",
  storageBucket: "hotel-management.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Actually using Supabase
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
);