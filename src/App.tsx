import { Navigate, Route, Routes } from "react-router";
import Constellation from "./pages/main/Constellation";
import Default from "./components/Default";
import DetailPost from "./pages/posts/DetailPost";
import PostsList from "./pages/posts/PostsList";
import PostCreatePage from "./pages/posts/PostCreatePage";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";
import UserSetting from "./pages/login/UserSetting";
import PostSearch from "./pages/search/PostSearch";
import UserSearch from "./pages/search/UserSearch";
import AuthLayout from "./pages/login/AuthLayout";
import SubLayout from "./components/SubLayout";
import UserPage from "./pages/userpage/UserPage";
import AuthCallback from "./pages/login/AuthCallback";
import UpdatePost from "./pages/posts/UpdatePost";
import { Toaster } from "react-hot-toast";
import MessagesPage from "./pages/chat/MessagesPage";
import ChatRoom from "./pages/chat/ChatRoom";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Default />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<Constellation />} />
          <Route element={<SubLayout />}>
            <Route
              path="/channel"
              element={<Navigate to="/channel/all" replace />}
            />
            <Route path="/channel/:channel" element={<PostsList />} />
            <Route path="/posts/:postId" element={<DetailPost />} />
            <Route path="/posts/:postId/modify" element={<UpdatePost />} />
            <Route path="/channel/all" element={<PostsList />} />
            {/* 테스트 하고 아래 코드 지우기 */}
            <Route
              path="/channel/:channel/write"
              element={<PostCreatePage />}
            />
            <Route path="/channel/write" element={<PostCreatePage />} />

            <Route path="/userPage/:userId" element={<UserPage />} />
            <Route path="/postSearch" element={<PostSearch />} />
            <Route path="/userSearch" element={<UserSearch />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:roomId" element={<ChatRoom />} />
          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/userSetting" element={<UserSetting />} />
          <Route path="/authcallback" element={<AuthCallback />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            padding: "12px 16px",
            background: "#1f2535",
            border: "1px solid #44387D",
            boxShadow: "0 0 15px rgba(123,97,255,0.2)",
            fontSize: "14px",
            color: "#fff",
          },
        }}
      />
    </>
  );
}
