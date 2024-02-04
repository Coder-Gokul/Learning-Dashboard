import React, { useEffect } from "react";
import { Form, Button, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../component/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";


function Register() {
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await RegisterUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/");
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
  });

  return (
    <div className="grid grid-cols-2">
      <div className="bg-primary h-screen flex justify-center items-center flex-col text-secondary">
        <h1>LEARNING DASHBOARD</h1>
        <h4 className="mt-5 font-normal">By GOKUL</h4>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-[420px]">
          <h1 className="mb-5 flex justify-center text-2xl">SIGN UP</h1>
          <Divider />
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="First Name" name="firstName" 
            rules={getAntdFormInputRules}>
              <Input placeholder="Enter your first name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" 
             rules={getAntdFormInputRules}>
              <Input placeholder="Enter your last name" />
            </Form.Item>
            <Form.Item label="Email" name="email" 
             rules={getAntdFormInputRules}>
              <Input placeholder="Enter your email"/>
            </Form.Item>
            <Form.Item label="Password" name="password" 
             rules={getAntdFormInputRules}>
              <Input.Password placeholder="Enter your password"/>
            </Form.Item>
            <Button
              className="bg-primary text-white h-[40px]  font-bold hover-text-white"
              htmlType="submit"
              block
              loading={buttonLoading}
            >
              {buttonLoading?"Loading":"SIGN UP"}
            </Button>
            <div className="flex justify-center mt-5">
              <span>
                Already have an account <Link to="/Login" className="text-primary hover-text-primary">Login</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
