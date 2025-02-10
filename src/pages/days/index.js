import React, { useState, useEffect } from "react";
import CustomTable from "../../components/table";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  AbsentStudents,
  books,
  closedEye,
  days,
  deleteIcon,
  editIcon,
  openedEye,
  quiz,
  video,
} from "../../assets/svgIcons";
import AddDay from "../../components/days/add";
import EditDay from "../../components/days/edit";
import DeleteDay from "../../components/days/delete";
import ShowHideDays from "../../components/days/showHide";
import { baseUrl, secondUrl } from "../../utils/baseUrl";
import DropMenu from "../../components/dropmenu";

function Days() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [initialDayData, setInitialDayData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const columns = [
    {
      key: "name",
      title: "Day Name",
      dataIndex: "lec_title",
      search: true,
    },
    {
      key: "lec_cover_link",
      title: "Image",
      dataIndex: "lec_cover_link",
      render: (row) => {
        console.log(row);
        return <img src={row} style={{ width: "100px" }} alt="" className="" />;
      },
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "lec_descriprion",
      render: (text) => <p className="lecture-description">{text}</p>,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => (
        <div className="actions-btns">
          {/* <div
            className="delete-btn c-pointer text-danger"
            onClick={() => setOpenDeleteModal(row)}
          >
            <div className="tooltip">Delete</div>
            {deleteIcon}
          </div>
          <div
            onClick={() => setOpenShowHideModal(row)}
            className={
              row?.hidden
                ? "showhide-btn c-pointer text-success"
                : "showhide-btn c-pointer text-danger"
            }
          >
            <div className="tooltip">{row?.hidden ? "Show" : "Hide"}</div>
            {row?.hidden ? closedEye : openedEye}
          </div> */}
          {/* <div
            className="open-btn c-pointer text-primary"
            onClick={() => setOpenEditModal(row)}
          >
            <div className="tooltip">Edit</div>
            {editIcon}
          </div> */}
          <DropMenu child={"Actions"}>
            <div className="actions-btn">
              <div
                className="open-btn c-pointer text-primary"
                onClick={() => navigate(`${row?.lec_id}/quiz?type=${"lec"}`)}
              >
                <div className="btn btn-primary">Quiz</div>
                
              </div>
              <div
                className="open-btn c-pointer text-success"
                onClick={() =>
                  navigate(
                    `${row?.lec_id}/videos?lec_videos_ids=${row?.lec_videos_ids}`
                  )
                }
              >
                <div className="btn btn-primary">Video</div>
              </div>
              <div
            className="open-btn c-pointer text-primary"
            onClick={() => navigate(`/lectures/${row?.lec_id}/score`)}
          >
            <div className="btn btn-success">Scores</div>
          </div>
            </div>
            
          </DropMenu>
          {/* <div
            className="open-btn c-pointer text-danger"
            onClick={() => navigate(`${row?.lec_id}/AbsentStudents`)}
          >
            <div className="tooltip">Absent Students</div>
            {AbsentStudents}
          </div> */}
          
        </div>
      ),
    },
  ];
  const { pack, group, lecture } = useParams();
  const getAllMyVediosFor = async () => {
    setIsPageLoading(true);

    let data_to_send = {
      package_id: pack,
      group_id: group,
      lec_sub_id: lecture,
    };

    console.log(JSON.stringify(data_to_send));

    try {
      const response = await fetch(secondUrl + "select_lectures.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.json();
      console.log(resData);

      if (Array.isArray(resData) && resData.length !== 0) {
        const allData = resData.map((item) => ({
          ...item,
        }));

        setInitialDayData(allData);
      } else {
        setInitialDayData([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    getAllMyVediosFor();
  }, []);

  return (
    <div className="lectures">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Days</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Day
        </button>
      </div>
      <CustomTable dataSource={initialDayData} columns={columns} />
      <AddDay  getFunction={getAllMyVediosFor} openModal={openModal} setOpenModal={setOpenModal} />
      <EditDay openModal={openEditModal} setOpenModal={setOpenEditModal} />
      <DeleteDay
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
      <ShowHideDays
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />
    </div>
  );
}

export default Days;
