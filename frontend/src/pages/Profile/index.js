import React from "react";
import { Tabs } from "antd";
import Courses from "./Courses";

function Profile() {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Courses" key="1">
        <Courses />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Profile;
