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




function Students() {
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState(null);
  const {id} = useParams();
  useEffect(() => {
    if(id)
    getStudents();
  }, [id]);
  const getStudents = async () => {
    try {
      const response = await fetch(baseUrl + "select_all_studnets.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gen_id: id }),
      });

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
      key: "",
      title: "",
      dataIndex: "student_",
      render: (e, row) => {
        return <span>{row?.student_}</span>;
      },
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            <div className="delete-btn c-pointer text-danger">
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
            </div>
            <div className="open-btn c-pointer text-success">
              <div className="tooltip">View Details</div>
              {openPage}
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="students">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Students</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Student
        </button>
      </div>
      <CustomTable dataSource={students} columns={columns} />
      {/* <AddStudent openModal={openModal} setOpenModal={setOpenModal} /> */}
    </div>
  );
}

export default Students;
