import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/table";
import { deleteIcon, editIcon } from "../../../assets/svgIcons";
import AddScore from "../../../components/groups/exams/scores/add";
import { baseUrl, secondUrl } from "../../../utils/baseUrl";
import { useParams } from "react-router-dom";
import Modal from "../../../components/modal";
import axios from "axios";
import toast from "react-hot-toast";

function ExamGroupsScores() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const { yearID, quiz_id, groupID } = useParams();
  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState(null);
  const getData = async () => {
    try {
      const response = await axios.post(
        secondUrl + "select_student_group_solved_exam.php",
        { exam_id: quiz_id, group_id: groupID },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = response.data?.students;
      setStudents(data);
      setData(data);
    } catch (err) {
      setData([]);
    }
  };

  const resetExam = async () => {
    setLoading(true);
    const dataSend = {
      quiz_id: quiz_id,
      student_id: rowData?.student_id,
    };
    try {
      const res = await axios.post(
        `${baseUrl}absence/reset_exam.php`,
        dataSend
      );
      if (res?.status == 200) {
        toast.success(res?.data);
        getData();
        setOpenResetModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      key: "student_id",
      title: "Student ID",
      dataIndex: "student_id",
    },
    {
      key: "student_name",
      title: "Student Name",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "student_score",
      title: "Score",
      dataIndex: "student_score",
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
        style={{ flexDirection: "column", justifyContent: "flex-start" }}
      >
        <b
          style={{ marginRight: "auto", marginLeft: "20px", fontSize: "30px" }}
        >
          Scores
        </b>
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
            <button className="btn btn-success" onClick={resetExam}>
              Confirm
            </button>

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
