import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import CourseForm from "./CourseForm";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { DeleteCourse, GetAllCourses } from "../../../apicalls/courses";
import { getDateFormat } from "../../../utils/helpers";

function Courses({ course }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  //To get owner inorder to disable the Add course button
  // const isOwner = user.role === "owner";
  // const isStudent = user.role === "student";
  // const isEducator = user.role === "educator";

  //Getting data from DB
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllCourses({ owner: user._id });
      if (response.success) {
        setCourses(response.data);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  //Delete the course
  const onDelete = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteCourse(id);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-6">
            <i
              className="ri-edit-2-line text-primary cursor-pointer"
              onClick={() => {
                setSelectedCourse(record);
                setShow(true);
              }}
            ></i>
            <i
              class="ri-delete-bin-line text-red-600 font-bold cursor-pointer"
              onClick={() => {
                onDelete(record._id);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        {
          <Button
            className="bg-primary text-white h-[40px]  font-bold hover-text-white"
            onClick={() => {
              setSelectedCourse(null); // clearing the add course form everytime when the button clicked
              setShow(true);
            }}
            //Disabling the ADD COURSE to everyone except owner
            // disabled={courses.length > 0 && (isStudent || isEducator)}
            // disabled={!isStudent}
          >
            Add Courses
          </Button>
        }
      </div>
      <Table columns={columns} dataSource={courses} className="mt-4" />
      {show && (
        <CourseForm
          show={show}
          setShow={setShow}
          reloadData={getData}
          course={selectedCourse}
        />
      )}
    </div>
  );
}

export default Courses;
