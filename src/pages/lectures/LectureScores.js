import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTable from "../../components/table";
import Toast from "../../components/toast";
import { baseUrl, secondUrl } from "../../utils/baseUrl";

function LectureScores() {
  const { yearID, lecture } = useParams();
  const [data, setData] = useState(null);
  const [students, setStudents] = useState(null);
  const [toast, setToast] = useState(false);

  const getData = async () => {
    try {
      const response = await fetch(secondUrl + "lecture_students_score.php", {
        method: "POST",
        header: { "Content-Type": "Application/Json" },
        body: JSON.stringify({ lec_id: lecture }),
      });
      const data = await response.json();
      setData(
        data?.message?.map((item) => {
          item.solved_score = (item.solved_score * 100 * 1).toFixed(0) + "%";
          return item;
        })
      );
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
      key: "Actions",
      title: "Actions",
      dataIndex: "reset_count",
      render: (e, row) => {
        return (
          <div className="rowDiv">
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  const response = await fetch(
                    secondUrl + "re_exam_lecture.php",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        student_id: row?.student_id,
                        lec_id: lecture,
                      }),
                    }
                  );
                  const x = await response?.text();
                  setToast({ type: "dark", message: x });
                  getData()
                } catch (err) {}
              }}
            >
              Remake
            </button>
          </div>
        );
      },
    },
    // {
    //   key: "parent_phone",
    //   title: "parent Phone Number",
    //   dataIndex: "parent_phone",
    // },
    {
      key: "score",
      title: "Score",
      dataIndex: "solved_score",
    },
  ];

  return (
    <div className="exam-scores">
      <div
        // className="tablePageHeader scoretablePageHeader"
        style={{ flexDirection: "column", justifyContent: "flex-start" }}
      >
        {/* <b style={{ marginRight: "auto", marginLeft: "20px" }}>Add Score</b> */}
        {/* <AddScore
        getStudents={getData}
        id={quiz_id}
          openModal={openModal}
          setOpenModal={setOpenModal}
          students={students}
        /> */}
      </div>
      <CustomTable dataSource={data} columns={columns} />
      {toast && (
        <Toast
          message={toast?.message}
          type={toast?.type}
          onClose={() => setToast(false)}
        />
      )}
    </div>
  );
}

export default LectureScores;
