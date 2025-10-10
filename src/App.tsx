// import { Navigate, Route, Routes } from 'react-router';
// import Constellation from './pages/main/Constellation';
// import Default from './components/Default';
// import Sample from './pages/main/Sample';
// import Home from './components/Home';
import { useEffect } from 'react';
import Login from './components/Login';
import supabase from './utils/supabase';

export default function App() {
  useEffect(() => {
    async function getProfile() {
      const { data: profile } = await supabase.from('profile').select();
      console.log(profile);
    }
    getProfile();
  }, []);
  return (
    <>
      <Login />
    </>
  );
}
