import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';
import supabase from '../../utils/supabase';

export default function UserSetting() {
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.name,
          exp: 0,
          badge: '초심자',
          level: 0,
          is_online: true,
        })
        .eq('_id', profile?._id)
        .select();
      if (error) throw error;
      if (data) {
        alert('회원가입이 완료되었습니다!');
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.display_name || '',
      });
    }
  }, [profile]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="bg-[#161C27] rounded-lg p-8 md:p-10 
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
      >
        <h1 className="text-2xl font-bold text-white mb-6">
          내 프로필 생성하기
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              닉네임
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-700 rounded-md 
                    bg-white text-gray-900 
                    focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              placeholder="닉네임을 입력하세요."
              required
            />
          </div>

          <div className="text-center mb-4">
            <span className="text-xs text-gray-400 leading-normal">
              이 스페이스에 접속하면, 이용 약관 및 개인정보처리방침에 동의하고
              14세 이상임을 확인하게 됩니다.
            </span>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 
                  bg-[#7C3AED] text-white rounded-md 
                  hover:bg-[#6D32D6] transition-colors font-medium text-lg 
                  shadow-lg shadow-[#7C3AED]/40"
          >
            입장하기
          </button>
        </form>
      </div>
    </div>
  );
}
