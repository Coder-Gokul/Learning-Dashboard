import React, { useEffect } from "react";
import { Form, Button, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../component/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function Login() {
  const { buttonLoading } = useSelector((state) => state.loaders);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await LoginUser(values);
      dispatch(SetButtonLoading(false));

      if (response.success) {
        //To store Token in Local Storage-----------
        localStorage.setItem("token", response.data);
        //-----------------------------------------
        message.success(response.message);
        //To navigate home screen page after successful login with 0.5 second delay
        setTimeout(function () {
          navigate("/");
        }, 500);
        //------------------------------------------------
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="grid grid-cols-2">
      <div className="bg-primary h-screen flex justify-center items-center flex-col text-secondary">
        <h1>LEARNING DASHBOARD</h1>
        <h4 className="mt-5 font-normal">By GOKUL</h4>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-[420px]">
          <h1 className="mb-5 flex justify-center text-2xl">
            LOGIN TO YOUR ACCOUNT
          </h1>
          <Divider />
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={getAntdFormInputRules}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Button
              className="bg-primary text-white h-[40px]  font-bold hover-text-white"
              htmlType="submit"
              block
              loading={buttonLoading}
            >
              {buttonLoading ? "loading" : "LOGIN"}
            </Button>
            <div className="flex justify-center mt-5">
              <span >
                Don't have an account <Link to="/Register" className="text-primary hover-text-primary">Register</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
