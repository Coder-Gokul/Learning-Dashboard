import { Form, Input, Modal, Select, message } from "antd";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { AddEducatorToCourse } from "../../../apicalls/courses";
import { getAntdFormInputRules } from "../../../utils/helpers";

function EducatorsForm({
  showEducatorsForm,
  setShowEducatorsForm,
  reloadData,
  course,
}) {
  console.log(course.members);
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log(values);
    try {
      //Check if educator already exists in the course
      const educatorExists = course.members.find(
        (member) => member.user.email === values.email
      );
      if (educatorExists) {
        throw new Error("User exists");
      } else {
        dispatch(SetLoading(true));
        //Add educator
        const response = await AddEducatorToCourse({
          courseId: course._id,
          email: values.email,
          role: values.role,
        });
        dispatch(SetLoading(false));
        if (response.success) {
          message.success(response.message);
          reloadData();
          setShowEducatorsForm(false);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  return (
    <Modal
      title="ADD EDUCATOR"
      open={showEducatorsForm}
      onCancel={() => setShowEducatorsForm(false)}
      centered
      okText="Add"
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
          <Input placeholder="Add educator email" />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={getAntdFormInputRules}>
          <Select placeholder="Select the role">
            <Select.Option value="Educator">Educator</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EducatorsForm;
