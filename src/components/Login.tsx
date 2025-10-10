import supabase from '../utils/supabase';

export default function Login() {
  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleGithubLogin = async () => {
    console.log('GitHub login');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // redirectTo: `${import.meta.env.VITE_URL}/login`,
          // redirectTo: `${import.meta.env.VITE_URL}/profile`, // 로그인 후 리다이렉트할 URL
        },
      });
      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };

  const handleKakaoLogin = () => {
    console.log('Kakao login');
  };
  return (
    <div>
      <h1>Welcome</h1>
      <p>Sign in to your account to continue</p>
      <div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Sign in with Google
        </button>
        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Sign in with GitHub
        </button>
        <button
          onClick={handleKakaoLogin}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Sign in with Kakao
        </button>
      </div>
    </div>
  );
}
