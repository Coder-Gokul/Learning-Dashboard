import { Button, Divider, Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { SetLoading } from "../../../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDateFormat } from "../../../utils/helpers";
// import Divider from "../../../component/Divider";
import { DeleteTask, GetAllTasks, UpdateTask } from "../../../apicalls/tasks";

function Tasks({ course }) {
  const [showViewTask, setShowViewTask] = useState(false);
  const { user } = useSelector((state) => state.users);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const dispatch = useDispatch();
  const clearTaskData = () => {
    setTask(null);
  };
  //get the students
  const isStudent = course.members.find(
    (member) => member.role === "student" && member.user._id === user._id
  );
  //get the owner
  const isOwner = course.members.find(
    (member) => member.role === "owner" && member.user._id === user._id
  );
  //get the educator
  const isEducator = course.members.find(
    (member) => member.role === "educator" && member.user._id === user._id
  );

  const [showTaskForm, setShowTaskForm] = useState(false);
  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({
        course: course._id,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        setTasks(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteTask(id);
      if (response.success) {
        getTasks();
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

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateTask({
        _id: id,
        status,
      });
      if (response.success) {
        getTasks();
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

  useEffect(() => {
    getTasks();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span
          className="underline  cursor-pointer hover:text-primary "
          onClick={() => {
            // giving task view access to owner,educator and specific student
            if (record.assignedTo._id === user._id) {
              setTask(record);
              setShowViewTask(true);
            }
            if (!isEducator && !isStudent) {
              setTask(record);
              setShowViewTask(true);
            }
          }}
        >
          {record.name}
        </span>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      render: (text, record) =>
        record.assignedTo.firstName + " " + record.assignedTo.lastName,
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      render: (text, record) =>
        record.assignedBy.firstName + " " + record.assignedBy.lastName,
    },
    {
      title: "Assigned On",
      dataIndex: "assignedOn",
      render: (text, record) => getDateFormat(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <select
            className="outline-none"
            value={record.status}
            onChange={(e) => {
              onStatusUpdate(record._id, e.target.value);
            }}
            disabled={
              record.assignedTo._id !== user._id && (isStudent || isOwner)
            }
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        );
      },
    },
    !isOwner && {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            className=" bg-black  text-white hover-text-white-bg-black "
            onClick={() => {
              setTask(record);
              setShowTaskForm(true);
            }}
          >
            Edit
          </Button>
          <Button
            className="bg-primary text-sm text-white hover-text-white rounded flex justify-center"
            onClick={() => {
              deleteTask(record._id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ].filter(Boolean);

  if (isStudent) {
    columns.pop();
  }

  return (
    <div>
      {!isStudent && !isOwner && (
        <div className="flex justify-end">
          <Button
            className="bg-primary text-white h-[40px]  font-bold hover-text-white mb-5"
            onClick={() => {
              clearTaskData();
              setShowTaskForm(true);
            }}
          >
            ADD TASK
          </Button>
        </div>
      )}
      <Table columns={columns} dataSource={tasks} />

      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          course={course}
          reloadData={getTasks}
          task={task}
        />
      )}

      {showViewTask && (
        <Modal
          title={
            <p className="text-primary text-xl flex justify-center font-extrabold">
              TASK DETAILS
            </p>
          }
          open={showViewTask}
          onCancel={() => setShowViewTask(false)}
          centered
          footer={null}
          width={700}
        >
          <Divider className="bg-primary h-0.5" />
          <div className="flex flex-col">
            <span className="text-xl font-bold  mb-5 ">{task.name}</span>
            <span className="text-md">- {task.description}</span>

            {/* Displaying uploaded img in the task popup */}
            <div className="flex gap-5">
              {task.attachments.map((image, index) => {
                return (
                  <a
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-40 h-40 object-cover mt-8 p-1 border-black border-2 border-solid rounded "
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Tasks;
