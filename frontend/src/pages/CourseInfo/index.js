import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SetLoading } from "../../redux/loadersSlice";
import { Divider, Tabs, message } from "antd";
import { GetCourseById } from "../../apicalls/courses";
import { getDateFormat } from "../../utils/helpers";
import Educators from "./Educators";
import Students from "./Students";
import Tasks from "./Tasks";

function CourseInfo() {
  const [currentUserRole, setCurrentUserRole] = useState("");
  const { user } = useSelector((state) => state.users);
  const [course, setCourse] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCourseById(params.id);
      dispatch(SetLoading(false));
      if (response.success) {
        setCourse(response.data);
        const currentUser = response.data.members.find(
          (member) => member.user._id === user._id
        );
        setCurrentUserRole(currentUser.role);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    course && (
      <div>
        <div className="flex justify-between mt-3">
          <div className=" w-9/12">
            <h1 className="text-primary font-semibold text-2xl uppercase mb-2">
              {course?.name}
            </h1>
            <span className="text-gray-600 text-sm">
              - {course?.description}
            </span>
          </div>
          <div>
            <div className="flex gap-5 mb-3">
              <span className="text-gray-600 text-sm font-semibold">
                CreatedAt
              </span>
              <span className="text-gray-600 text-sm">
                {getDateFormat(course.createdAt)}
              </span>
            </div>
            <div className="flex gap-5 mb-3">
              <span className="text-gray-600 text-sm font-semibold">
                CreatedBy
              </span>
              <span className="text-gray-600 text-sm">
                {course.owner.firstName} {course.owner.lastName}
              </span>
            </div>
            <div className="flex gap-5">
              <span className="text-gray-600 text-sm font-semibold ml-11">
                Role
              </span>
              <span className="text-gray-600 text-sm text-transform: capitalize">
                {currentUserRole}
              </span>
            </div>
          </div>
        </div>
        <Divider className="border-gray-400" />
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="TASKS" key="1">
            <Tasks course={course}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="EDUCATORS" key="2">
            <Educators course={course} reloadData={getData} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="STUDENT" key="3">
            <Students course={course} reloadData={getData} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  );
}

export default CourseInfo;
