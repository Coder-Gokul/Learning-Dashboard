import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { Button, Divider, message } from "antd";
import { GetCoursesByRole } from "../../apicalls/courses";
import { getDateFormat } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
function Home() {
  const [courses, setCourses] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCoursesByRole();
      dispatch(SetLoading(false));
      if (response.success) {
        setCourses(response.data);
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
    <div>
      <div className="pt-8 pb-8 ml-2">
        Hey{" "}
        <span className="text-primary">
          {user?.firstName} {user?.lastName}
        </span>
        , Welcome to Learning Dashboard.
      </div>

      <div className="flex justify-start items-center  bg-primary  rounded-2xl flex-col">
        <div>
          <h1 className="text-2xl mt-5 text-white">COURSES</h1>
        </div>

        <div className=" grid lg:grid-cols-4 gap-5 mt-5 p-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {courses.map((course) => (
            <div
              className="flex flex-col gap-1 border-4 border-solid  border-white rounded-lg p-2 cursor-pointer"
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <div className="flex flex-col ">
                <h1 className="text-white text-base flex justify-center mt-3">
                  {course.name.toUpperCase()}
                </h1>
                <span className="course-description text-white text-sm flex flex-wrap font-light tracking-widest items-center justify-left h-20 ml-2 mt-5 ">
                  - {course.description}
                </span>
              </div>
              <div className="bottom flex flex-col ">
                <Divider className="border-gray-300" />
                <div className="flex justify-between text-xs font-medium text-white mx-2 mb-2">
                  <div>Created At </div>
                  <div className="ml-10">{getDateFormat(course.createdAt)}</div>
                </div>
                <div className="flex justify-between text-xs font-medium text-white mx-2 mb-2">
                  <div>Duration </div>
                  <div>{course.duration}</div>
                </div>
                <div className="flex justify-between text-xs font-medium text-white mx-2 mb-2">
                  <div>Created By </div>
                  <div>{course.owner.firstName}</div>
                </div>

                <div className="flex justify-between text-xs font-medium text-white mx-2 mb-2">
                  <div></div>
                  <Button className="capitalize w-15 h-6 text-xs font-extrabold text-primary mt-5 hover-text-primary">
                    {course.status}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="flex">
            <h1 className="text-primary text-xl my-20 p-2 bg-white rounded-lg ">
              Sorry ! No Courses Found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
