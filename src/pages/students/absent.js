import React, { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import "./style.css";

import { useParams } from "react-router-dom";
import {
  closedEye,
  deleteIcon,
  editIcon,
  openedEye,
  openPage,
} from "../../assets/svgIcons";
import { baseUrl } from "../../utils/baseUrl";
import PauseStudent from "../../components/groupsStudents/absent/pause";

function AbsentStudents() {
  const [openPauseModal, setOpenPauseModal] = useState(false);
  const [students, setStudents] = useState(null);
  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const response = await fetch(
        baseUrl + "absence/select_list_of_absence_students.php"
      );

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]);
    }
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "doctor_name",
      title: "Year",
      dataIndex: "doctor_name",
      render: (e, row) => {
        return <span>{row?.doctor_name}</span>;
      },
    },
    {
      key: "age",
      title: "Group",
      dataIndex: "group_name",
      render: (e, row) => {
        return <span>{row?.group_name}</span>;
      },
    },
    {
      key: "",
      title: "",
      dataIndex: "student_",
      render: (e, row) => {
        return <span>{row?.student_}</span>;
      },
    },
    {
      key: "phone",
      title: "Phone",
      dataIndex: "student_phone",
      render: (e, row) => {
        return <span>{row?.student_phone}</span>;
      },
    },
    {
      key: "parent_phone",
      title: "Parent Phone",
      dataIndex: "parent_phone",
    },
    {
      key: "absences_count",
      title: "absences_count",
      dataIndex: "absences_count",
    },
    {
      key: "Reason",
      title: "Reason",
      dataIndex: "reason",
      render: (e, row) => {
        return <span>{row?.reason}</span>;
      },
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            {/* <div className="delete-btn c-pointer text-danger">
              <div className="tooltip">Delete</div>
              {deleteIcon}
            </div>
            <div className="open-btn c-pointer text-primary">
              <div className="tooltip">Edit</div>
              {editIcon}
            </div>
            <div
              className={
                row?.hidden
                  ? "showhide-btn c-pointer text-success"
                  : "showhide-btn c-pointer text-danger"
              }
            >
              <div className="tooltip">{row?.hidden ? "Show" : "Hide"}</div>
              {row?.hidden ? closedEye : openedEye}
            </div> */}
            {row?.pause_status == "no" ? (
              <div className="open-btn c-pointer text-danger" onClick={()=>{
                setOpenPauseModal(row)
              }}>
                <div className="tooltip">Pause</div>
                <div className="btn btn-danger">Pause</div>
              </div>
            ) : (
              "Paused"
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div className="students">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Students</h1>
        {/* <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Student
        </button> */}
      </div>
      <CustomTable dataSource={students} columns={columns} />
      {/* <AddStudent openModal={openModal} setOpenModal={setOpenModal} /> */}
      <PauseStudent getFunction={getStudents} openModal={openPauseModal} setOpenModal={setOpenPauseModal} /> 
    </div>
  );
}

export default AbsentStudents;
