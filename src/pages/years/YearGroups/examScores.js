import React, {useEffect, useState} from "react";
import CustomTable from "../../../components/table";
import {deleteIcon, editIcon} from "../../../assets/svgIcons";
import AddScore from "../../../components/groups/exams/scores/add";
import {baseUrl} from "../../../utils/baseUrl";
import {useParams} from "react-router-dom";
import Modal from "../../../components/modal";

function ExamGroupsScores() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const {yearID, quiz_id} = useParams();
  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState([]);

  const [students, setStudents] = useState(null);
  const getData = async () => {
    try {
      const response = await fetch(
        baseUrl + "absence/select_quiz_students.php",
        {
          method: "POST",
          header: {"Content-Type": "Application/Json"},
          body: JSON.stringify({quiz_id: quiz_id}),
        }
      );
      const data = await response.json();
      setStudents(data?.filter((item) => item?.score == "-"));
      setData(data);
    } catch (err) {
      setData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      key: "name",
      title: "Student Name",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "phone",
      title: "Phone Number",
      dataIndex: "student_phone",
    },
    {
      key: "parent_phone",
      title: "parent Phone Number",
      dataIndex: "parent_phone",
    },
    {
      key: "score",
      title: "Score",
      dataIndex: "score",
    },
    {
      key: "action",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-danger"
                onClick={() => {
                  setOpenResetModal(true);
                  setRowData(row);
                }}
              >
                Reset Exam
              </button>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="exam-scores">
      <div
        className="tablePageHeader scoretablePageHeader"
        style={{flexDirection: "column", justifyContent: "flex-start"}}
      >
        <b style={{marginRight: "auto", marginLeft: "20px"}}>Add Score</b>
        <AddScore
          getStudents={getData}
          id={quiz_id}
          openModal={openModal}
          setOpenModal={setOpenModal}
          students={students}
        />
      </div>
      <CustomTable dataSource={data} columns={columns} />

      <Modal
        close={setOpenResetModal}
        footer={false}
        title={"Reset Exam"}
        visible={openResetModal}
      >
        <div className="d-flex flex-column gap-3 ">
          <div className="fs-5 bold">Are You Sure To Reset This Student?</div>
          <div className="d-flex justify-content-end gap-3 align-items-center">
            <button className="btn btn-success">Confirm</button>

            <button
              className="btn btn-danger"
              onClick={() => setOpenResetModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExamGroupsScores;
