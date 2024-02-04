import { Form, Input, Modal, Select, message } from "antd";
import React from "react";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateCourse, EditCourse } from "../../../apicalls/courses";

function CourseForm({ show, setShow, reloadData, course }) {
  const duration = [
    "1 month",
    "2 month",
    "3 month",
    "4 month",
    "5 month",
    "6 month",
    "7 month",
    "8 month",
    "9 month",
    "10 month",
    "11 month",
    "1 year",
  ];

  const formRef = React.useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (course) {
        // edit course
        values._id = course._id;
        response = await EditCourse(values);
      } else {
        // create course
        values.owner = user._id;
        values.members = [
          {
            user: user._id,
            role: "owner",
          },
        ];
        response = await CreateCourse(values);
      }
      if (response.success) {
        message.success(response.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
    }
  };

  const modalTitleStyle = {
    color: "#ff6347", // Setting text color for the Modal title
    display: "flex",
    justifyContent: "center",
    fontSize: "20px",
  };

  return (
    <Modal
      // title="ADD COURSE"
      title={
        <span style={modalTitleStyle}>
          {course ? "EDIT COURSE" : "ADD COURSE"}
        </span>
      }
      open={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText="Save"
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={course}
      >
        <Form.Item label="Course Name" name="name">
          <Input placeholder="Add your course name" />
        </Form.Item>
        <Form.Item label=" Course Duration" name="duration">
          <Select placeholder="Select course duration">
            {duration.map((period, index) => {
              return (
                <Select.Option key={index} value={period}>
                  {period}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Course Description" name="description">
          <TextArea placeholder="Add your course description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default CourseForm;
