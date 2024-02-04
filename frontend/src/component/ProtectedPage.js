import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { GetLoggedInUser } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";

function ProtectedPage({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetLoggedInUser();
      dispatch(SetLoading(false));

      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    user && (
      <div>
        <div className="flex justify-between items-center bg-primary text-white p-2">
          <h1
            className="text-2xl font-base cursor-pointer "
            onClick={() => {
              navigate("/");
            }}
          >
            LEARNING DASHBOARD
          </h1>

          <div className="flex items-center">
            <div className="flex items-center bg-white px-5 py-2 rounded">
              <i className="ri-notification-3-line text-white font-bold bg-primary rounded-full p-2"></i>
              <span
                className="text-black ml-2 hover:underline decoration-1 hover:text-primary decoration-orange-500 cursor-pointer"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                {user?.firstName}
              </span>
            </div>
            <div>
              <i
                className="ri-logout-box-r-line  text-white font-normal text-2xl p-2 ml-8 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  message.success("Logged out successfully");
                  navigate("/login");
                }}
              ></i>
            </div>
          </div>
        </div>
        <div className="px-5 py-3">{children}</div>
      </div>
    )
  );
}
export default ProtectedPage;
