import { Button, Table, message } from "antd";
import React, { useState } from "react";
import EducatorsForm from "./EducatorsForm";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { RemoveEducatorFromCourse } from "../../../apicalls/courses";

function Educators({ course, reloadData }) {
  const [showEducatorsForm, setShowEducatorsForm] = useState(false);
  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const isOwner = course.owner._id === user._id;

  const deleteEducator = async (memberId) => {
    try {
      dispatch(SetLoading(true));
      const response = await RemoveEducatorFromCourse({
        courseId: course._id,
        memberId,
      });
      if (response.success) {
        reloadData();
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  //Filtering the Educators
  const educatorsData = course.members.filter(
    (member) => member.role === "Educator"
  );

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text, record) => record.user.firstName,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      render: (text, record) => record.user.lastName,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => record.user.email,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => record.role.toUpperCase(),
    },
    {
      title: "Action",
      dataIndex: "action",

      render: (text, record) => (
        <Button
          className="y text-white h-[40px]  font-bold"
          danger
          onClick={() => deleteEducator(record._id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  //if not owner, then don't show the action column
  if(!isOwner){
    columns.pop();
  }

  // Displaying Add Educator button only to the owner

  return (
    <div>
      <div className="flex justify-end">
        {isOwner && (
          <Button
            className="bg-primary text-white h-[40px]  font-bold hover-text-white"
            onClick={() => setShowEducatorsForm(true)}
          >
            ADD EDUCATOR
          </Button>
        )}
      </div>

      <Table columns={columns} dataSource={educatorsData} className="mt-4" />

      {showEducatorsForm && (
        <EducatorsForm
          showEducatorsForm={showEducatorsForm}
          setShowEducatorsForm={setShowEducatorsForm}
          reloadData={reloadData}
          course={course}
        />
      )}
    </div>
  );
}

export default Educators;
