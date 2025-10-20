import supabase from "../../utils/supabase";
import { Github } from "lucide-react";
import Logo from "../../assets/image/logo.png";
export default function Login() {
  type AuthProvider = "google" | "github" | "discord";

  const handleOAuthLogin = async (provider: AuthProvider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider, // 인자로 받은 provider를 사용
        options: {
          redirectTo: `${import.meta.env.VITE_URL}/authcallback`, // 로그인 후 리디렉션할 URL
        },
      });
      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        className="bg-[#161C27] rounded-lg p-8 md:p-10 
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="text-center mb-8">
          <img src={Logo} alt="CHICKEN GALAXY" className="mx-auto mb-2" />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 hover:bg-gray-100 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google 계정으로 로그인
          </button>

          <button
            onClick={() => handleOAuthLogin("github")}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-700 rounded-md shadow-sm bg-[#24292e] text-white hover:bg-[#3b4146] transition-colors font-medium"
          >
            <Github size={20} className="mr-3" />
            GitHub 계정으로 로그인
          </button>

          <button
            onClick={() => handleOAuthLogin("discord")}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-700 rounded-md shadow-sm bg-[#5865F2] text-white hover:bg-[#4E5AE2] transition-colors font-medium"
          >
            <svg
              className="w-5 h-5 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.22 3.869c-.8-.54-1.631-.952-2.493-1.233A19.8 19.8 0 0 0 12 2a19.8 19.8 0 0 0-5.727.636 17.5 17.5 0 0 0-2.492 1.233C3.21 4.545 2.5 5.565 2.5 6.777v10.603c0 1.212.71 2.232 1.508 2.896.862.584 1.83.992 2.872 1.258A21.5 21.5 0 0 0 12 22c2.72 0 5.372-.614 7.747-1.849 1.042-.266 2.01-.674 2.872-1.258.798-.664 1.508-1.684 1.508-2.896V6.777c0-1.212-.71-2.232-1.508-2.896zM12 18.2c-3.79 0-6.86-2.583-6.86-5.767S8.21 6.667 12 6.667c3.79 0 6.86 2.583 6.86 5.767s-3.07 5.766-6.86 5.766zm-3.078-4.324c-.79 0-1.433-.61-1.433-1.36s.643-1.36 1.433-1.36c.79 0 1.432.61 1.432 1.36s-.642 1.36-1.432 1.36zm6.156 0c-.79 0-1.433-.61-1.433-1.36s.643-1.36 1.433-1.36c.79 0 1.432.61 1.432 1.36s-.642 1.36-1.432 1.36z" />
            </svg>
            디스코드 계정으로 로그인
          </button>
        </div>

        <div className="mt-8 text-center">
          <span className="text-sm text-gray-400">
            <div>로그인 시 Chicken Galaxy의 개인정보처리방침과</div>
            <div>이용 약관에 동의한 것으로 간주합니다.</div>
          </span>
        </div>
      </div>
    </div>
  );
}
