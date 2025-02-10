import React, { useState } from "react";
import AddScore from "../../../components/scores/add";
import CustomTable from "../../../components/table";
import "./style.css";
import { deleteIcon, editIcon } from "../../../assets/svgIcons";
import DeleteScore from "../../../components/scores/delete";
import EditScore from "../../../components/scores/edit";
import { initialStudentData } from "../../../data/studentsdata";

const initialData = [
  {
    key: "1",
    name: "Ahmed Ali",
    phone: "0100-123-4567",
    score: 85,
  },
  {
    key: "2",
    name: "Fatma Hassan",
    phone: "0122-987-6543",
    score: 92,
  },
  {
    key: "3",
    name: "Mohamed El-Sayed",
    phone: "0111-555-7890",
    score: 78,
  },
  {
    key: "4",
    name: "Mona Ibrahim",
    phone: "0109-876-5432",
    score: 88,
  },
  {
    key: "5",
    name: "Omar Youssef",
    phone: "0123-456-7890",
    score: 91,
  },
];

function QuizScores() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const columns = [
    {
      key: "name",
      title: "Student Name",
      dataIndex: "name",
      search: true,
    },
    {
      key: "phone",
      title: "Phone Number",
      dataIndex: "student_phone",
    },
    {
      key: "score",
      title: "Score",
      dataIndex: "score",
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            <div
              className="delete-btn c-pointer text-danger"
              onClick={() => setOpenDeleteModal(row)}
            >
              <div className="tooltip">Delete</div>
              {deleteIcon}
            </div>
            <div
              className="open-btn c-pointer text-primary"
              onClick={() => setOpenEditModal(row)}
            >
              <div className="tooltip">Edit</div>
              {editIcon}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="exam-scores">
      <div
        className="tablePageHeader scoretablePageHeader"
        style={{ flexDirection: "column", justifyContent: "flex-start" }}
      >
        <b style={{ marginRight: "auto", marginLeft: "20px" }}>Add Score</b>
        <AddScore
          openModal={openModal}
          setOpenModal={setOpenModal}
          students={initialStudentData} 
        

        />
      </div>
      <CustomTable dataSource={initialData} columns={columns} />
      <EditScore openModal={openEditModal} setOpenModal={setOpenEditModal}  />
      <DeleteScore
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
    </div>
  );
}

export default QuizScores;