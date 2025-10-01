import React from "react";
import { AiOutlineSetting, AiOutlineMail, AiOutlinePhone, AiOutlineLogout } from "react-icons/ai";

const NotificationPage: React.FC = () => {
  // Giả lập thông tin user
  const user = {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "+84 123 456 789",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Administrator",
  };

  return (
    <div className="min-h-screen pt-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center">
          <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full shadow-md mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.role}</p>
        </div>

        {/* User Info */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <AiOutlineMail size={20} className="text-gray-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <AiOutlinePhone size={20} className="text-gray-500" />
            <span>{user.phone}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition">
            <AiOutlineSetting size={18} />
            <span>Settings</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            <AiOutlineLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
