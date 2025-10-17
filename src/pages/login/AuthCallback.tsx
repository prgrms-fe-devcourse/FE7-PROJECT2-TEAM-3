import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import supabase from "../../utils/supabase";
import loading_img from "../../assets/image/loading_img.png";

export default function AuthCallback() {
  const navigate = useNavigate();
  const claims = useAuthStore((state) => state.claims);

  useEffect(() => {
    const processUser = async () => {
      if (!claims?.sub) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("exp")
        .eq("_id", claims.sub)
        .maybeSingle();

      if (error) {
        console.error("프로필 조회 에러:", error);
        navigate("/login");
        return;
      }

      if (profile && profile.exp !== null) {
        await supabase
          .from("profiles")
          .update({ is_online: true })
          .eq("_id", claims.sub);
        navigate("/home");
      } else {
        await supabase.from("profiles").insert([
          {
            _id: claims.sub,
            exp: 0,
            badge: "치킨 미개봉자",
            level: 0,
            is_online: true,
            bio: "",
          },
        ]);
        navigate("/userSetting");
      }
    };

    if (claims?.sub) {
      processUser();
    }
  }, [claims?.sub, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex-center flex-col">
        <img
          className="w-40 h-40 animate-flyingRocket"
          src={loading_img}
          alt={"로딩중 이미지"}
        />
        <div className="flex items-center gap-1 text-2xl font-black text-white text-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          <span
            className="animate-loading-text"
            style={{ animationDelay: "0s" }}
          >
            로
          </span>
          <span
            className="animate-loading-text"
            style={{ animationDelay: "0.2s" }}
          >
            딩
          </span>
          <span
            className="animate-loading-text"
            style={{ animationDelay: "0.4s" }}
          >
            중
          </span>
          <span
            className="animate-loading-text"
            style={{ animationDelay: "0.6s" }}
          >
            .
          </span>
          <span
            className="animate-loading-text"
            style={{ animationDelay: "0.8s" }}
          >
            .
          </span>
          <span
            className="animate-loading-text"
            style={{ animationDelay: "1s" }}
          >
            .
          </span>
        </div>
      </div>
    </div>
  );
}
