import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DropMenu from "../../components/dropmenu";
import AddPackage from "../../components/Packages/add";
import DeletePackage from "../../components/Packages/delete";
import EditPackage from "../../components/Packages/edit";
import ShowHidePackages from "../../components/Packages/showHide";
import CustomTable from "../../components/table";
import { secondUrl } from "../../utils/baseUrl";
import PdfOpen from "../../components/Packages/pdf";

function Packages() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [getPackagesLoading, setGetPackagesLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");

  const { group } = useParams();

  const columns = [
    {
      key: "name",
      title: "Package Name",
      dataIndex: "name",
      search: true,
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <p
          className="package-description"
          style={{ width: "240px", whiteSpace: "pre-wrap" }}
        >
          {text}
        </p>
      ),
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
          </div>*/}

          <DropMenu>
            <div className="actions-btns">
              <div
                onClick={() =>
                  navigate(`/SubscriptionCounts/${row?.package_id}/students`)
                }
              >
                <div className="btn btn-primary">Students</div>
              </div>
              <div
                className="open-btn c-pointer text-primary"
                onClick={() => setPdfOpen(row)}
              >
                <div className="btn btn-primary">PDF</div>
                {/* {editIcon} */}
              </div>
              <div
                className="open-btn c-pointer text-primary"
                onClick={() => setOpenEditModal(row)}
              >
                <div className="btn btn-primary">Edit</div>
                {/* {editIcon} */}
              </div>
              <div
                className="open-btn c-pointer text-primary"
                onClick={() => navigate(`${row?.package_id}/lectures`)}
              >
                <div className="btn btn-primary">Lectures</div>
              </div>
            </div>
          </DropMenu>
        </div>
      ),
    },
  ];

  const getPackages = async () => {
    setGetPackagesLoading(true);
    setIsPageLoading(true);

    let data_to_send = {
      group_id: group,
    };

    try {
      const response = await fetch(secondUrl + "select_packages.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.json();
      console.log(resData);

      if (response.status === 200) {
        if (Array.isArray(resData.packages)) {
          if (resData.packages.length === 0) {
            setPackagesData([]);
            setSelectedPackageId("");
          } else {
            setPackagesData(resData.packages);
            setSelectedPackageId(resData.packages[0]?.package_id);
          }
        }
      } else {
        console.error("Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setGetPackagesLoading(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  return (
    <div className="packages">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Packages</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Package
        </button>
      </div>
      <CustomTable dataSource={packagesData} columns={columns} />
      <PdfOpen
        getFunction={getPackages}
        openModal={pdfOpen}
        setOpenModal={setPdfOpen}
      />
      <AddPackage
        getFunction={getPackages}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <EditPackage
        getFunction={getPackages}
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      />
      <DeletePackage
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
      <ShowHidePackages
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />
    </div>
  );
}

export default Packages;
