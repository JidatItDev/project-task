import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Separator } from "@/components/ui/separator"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { 
      to: "/admin/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-4 w-4" /> 
    },
    { 
      to: "/admin/UsersListPage", 
      label: "Users", 
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      to: "/admin/AdminBookingsCalendarPage", 
      label: "Calendar", 
      icon: <Calendar className="h-4 w-4" /> 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white flex flex-col fixed top-0 left-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-400">Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  location.pathname === item.to
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Separator className="my-6 bg-gray-800" />
        
        {/* Quick Stats */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Today's Overview</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-900 rounded p-2">
              <p className="text-xs text-gray-400">New Users</p>
              <p className="text-lg font-bold">12</p>
            </div>
            <div className="bg-gray-900 rounded p-2">
              <p className="text-xs text-gray-400">Bookings</p>
              <p className="text-lg font-bold">24</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@example.com</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
