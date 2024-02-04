import { Form, Input, Modal, Tabs, message, Upload, Button } from "antd";

import TextArea from "antd/es/input/TextArea";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import {
  CreateTask,
  UpdateTask,
  UploadTaskImage,
} from "../../../apicalls/tasks";
// import { response } from "express";

function TaskForm({ showTaskForm, setShowTaskForm, course, task, reloadData }) {
  const [selectedTab = "1", setSelectedTab] = useState("1");
  const [file = null, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.users);
  const [images = [], setImages] = useState(task?.attachments || []);
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      let response = null;
      dispatch(SetLoading(true));
      if (task) {
        //update task
        response = await UpdateTask({
          ...values,
          course: course._id,
          assignedTo: task.assignedTo._id,
          _id: task._id,
        });
      } else {
        const assignedToMember = course.members.find(
          (member) => member.user.email === email
        );
        const assignedToUserId = assignedToMember.user._id;
        const assignedBy = user._id;
        response = await CreateTask({
          ...values,
          course: course._id,
          assignedTo: assignedToUserId,
          assignedBy,
        });
      }
      if (response.success) {
        message.success(response.message);
        setShowTaskForm(false);
        reloadData();
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const validateEmail = () => {
    const studentInCourse = course.members.filter(
      (member) => member.role === "student"
    );
    const isEmailValid = studentInCourse.find(
      (student) => student.user.email === email
    );
    return isEmailValid ? true : false;
  };

  const uploadTaskImage = async () => {
    try {
      dispatch(SetLoading(true));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", task._id);
      const response = await UploadTaskImage(formData);
      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        reloadData();
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(SetLoading(true));
      const attachments = images.filter((img) => img !== image);
      const response = await UpdateTask({
        ...task,
        attachments,
      });
      if (response.success) {
        message.success(response.message);
        setImages(attachments);
        reloadData();
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  return (
    <Modal
      title={task ? "UPDATE TASK" : "CREATE TASK"}
      open={showTaskForm}
      onCancel={() => setShowTaskForm(false)}
      centered
      onOk={() => {
        formRef.current.submit();
      }}
      okText={task ? "UPDATE" : "CREATE"}
      width={800}
      // if the selected tab is attachment tab then it'll remove the cancel & update button
      {...(selectedTab === "2" && { footer: null })}
    >
      <Tabs activeKey={selectedTab} onChange={(key) => setSelectedTab(key)}>
        <Tabs.TabPane tab="Task Details" key="1">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{
              ...task,
              assignedTo: task ? task.assignedTo.email : "",
            }}
          >
            <Form.Item label="Task Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Task Description" name="description">
              <TextArea />
            </Form.Item>
            <Form.Item label="Assign To" name="assignedTo">
              <Input
                placeholder="Enter email of the student"
                onChange={(e) => setEmail(e.target.value)}
                disabled={task ? true : false}
              />
            </Form.Item>

            {email && !validateEmail() && (
              <div className="bg-red-700 text-sm p-2 rounded flex justify-center">
                <span className="text-white">
                  Email is not valid or Student is not in the Course
                </span>
              </div>
            )}
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="Attachments"
          key="2"
          //disabling Attachmensts tab untill we create the task details
          disabled={!task}
        >
          {/* Displaying previously uploaded img in the img-upload box */}
          <div className="flex gap-5 mb-5">
            {images.map((image) => {
              return (
                <div className="flex gap-3 p-2 border border-solid rounded items-end">
                  <img
                    src={image}
                    alt=""
                    className="w-20 h-20 object-cover mt-2"
                  />
                  <i
                    className="ri-delete-bin-line"
                    onClick={() => deleteImage(image)}
                  ></i>
                </div>
              );
            })}
          </div>

          <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              setFile(info.file);
            }}
            listType="picture"
          >
            <Button type="dashed" className="border-black">
              {" "}
              Upload Images
            </Button>
          </Upload>
          <div className="flex justify-end mt-4 gap-5">
            <Button type="default" onClick={() => setShowTaskForm(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={uploadTaskImage} disabled={!file}>
              Upload
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default TaskForm;
