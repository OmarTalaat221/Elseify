import React, { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import "./style.css";

import { baseUrl } from "../../utils/baseUrl";
import { useParams } from "react-router-dom";
import { FaKipSign } from "react-icons/fa6";
import AddScore from "../../components/groupsStudents/addScore";

function GroupStudents() {
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    getStudents();
  }, []);
  const getStudents = async () => {
    try {
      const response = await fetch(baseUrl + "3rd_offline_assign/select_group_students.php", {
        method: "POST",
        headers: { "Content-Type": "Application/Json" },
        body: JSON.stringify({ group_id: id }),
      });

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]);
    }
  };

  const columns = [
    {
      key: "Student Name",
      title: "student_name",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "School Name",
      title: "school_name",
      dataIndex: "school_name",
      search: true,
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
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            <div className="delete-btn c-pointer text-danger" onClick={()=>setOpenModal(row)}>
              <div className="tooltip" >Sign Score</div>
              <FaKipSign/>
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
      <AddScore id={id} openModal={openModal} setOpenModal={setOpenModal} getFunction={getStudents}/>
    
    </div>
  );
}

export default GroupStudents;
