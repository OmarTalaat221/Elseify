import React, { useEffect, useState } from "react";
import Modal from "../../../modal";
import axios from "axios";

import Loader from "../../../loader";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { secondUrl } from "../../../../utils/baseUrl";
import toast from "react-hot-toast";
import Select from "react-select";
function Duplicate({ getFunction, openModal, setOpenModal, rowData }) {
  const { lecture, pack, yearId, group, lec_videos_ids, day } = useParams();
  const [search] = useSearchParams();

  const [groups, setGroups] = useState([]);
  const [packages, setPackages] = useState([]);
  const [sub, setSub] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [duplicateData, setDuplicateData] = useState({
    group_id: "",
    pack_id: "",
    lec_sub_id: "",
    lec_ids: "",
    loading: false,
  });

  const navigate = useNavigate();
  const getGroups = async () => {
    setDuplicateData({ ...duplicateData, loading: true });

    try {
      const res = await axios.get(`${secondUrl}select_groups.php`);

      if (res?.status == 200) {
        setGroups(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDuplicateData({ ...duplicateData, loading: false });
    }
  };

  const getPackages = async () => {
    setDuplicateData({ ...duplicateData, loading: true });
    const dataSend = {
      group_id: duplicateData?.group_id?.value,
    };
    try {
      const res = await axios.post(`${secondUrl}select_packages.php`, dataSend);

      if (res?.status == 200) {
        setPackages(res?.data?.packages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDuplicateData({ ...duplicateData, loading: false });
    }
  };

  const getSub = async () => {
    setDuplicateData({ ...duplicateData, loading: true });
    const dataSend = {
      group_id: duplicateData?.group_id?.value,
      package_id: duplicateData?.pack_id?.value,
    };

    try {
      const res = await axios.post(`${secondUrl}select_subject.php`, dataSend);

      if (res?.status == 200) {
        setSub(res?.data?.subjects);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDuplicateData({ ...duplicateData, loading: false });
    }
  };

  const getLectures = async () => {
    setDuplicateData({ ...duplicateData, loading: true });
    const dataSend = {
      group_id: duplicateData?.group_id?.value,
      package_id: duplicateData?.pack_id?.value,
      lec_sub_id: duplicateData?.lec_sub_id?.value,
    };
    try {
      const res = await axios.post(`${secondUrl}select_lectures.php`, dataSend);

      if (res?.status == 200) {
        setLectures(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDuplicateData({ ...duplicateData, loading: false });
    }
  };
  const duplicateVideo = async (e) => {
    e.preventDefault();

    setDuplicateData((prev) => ({ ...prev, loading: true }));

    let lecIds = duplicateData?.lec_ids?.map((item) => item?.value) || [];

    if (!lecIds.length) {
      toast.error("At least one lecture ID is required.");
      setDuplicateData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const dataSend = {
      generation_id: yearId,
      lec_id: lecIds.join("//CAMP//"),
      vedio_id: rowData?.video_id,
    };

    try {
      const res = await axios.post(`${secondUrl}duplicate_video.php`, dataSend);

      if (res?.status === 200) {
        toast.success(res.data || "Video duplicated successfully!");
        setOpenModal(false);
        setDuplicateData({
          group_id: "",
          pack_id: "",
          lec_sub_id: "",
          lec_ids: "",
          loading: false,
        });
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Server error: ${error.response.data}`);
      } else if (error.request) {
        toast.error(
          "No response from the server. Please check your connection."
        );
      } else {
        toast.error(`Error: ${error.message}`);
      }
      console.error("Error duplicating video:", error);
    } finally {
      setDuplicateData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    if (duplicateData?.group_id) {
      getPackages();
    }
  }, [duplicateData?.group_id]);
  useEffect(() => {
    if (duplicateData?.pack_id) {
      getSub();
    }
  }, [duplicateData?.pack_id]);
  useEffect(() => {
    if (duplicateData?.lec_sub_id) {
      getLectures();
    }
  }, [duplicateData?.lec_sub_id]);

  useEffect(() => {
    console.log(duplicateData);
  }, [duplicateData]);

  return (
    <>
      <Modal
        close={() => setOpenModal(false)}
        footer={false}
        title={"Duplicate Video"}
        visible={openModal}
      >
        <form className="animated-form" onSubmit={duplicateVideo}>
          <div className="form-group">
            <label htmlFor="group" className="animated-label">
              Enter Group
            </label>
            <Select
              id="group"
              options={groups?.map((e) => ({
                value: e?.group_id,
                label: e?.group_name,
              }))}
              placeholder="Enter Group..."
              value={duplicateData?.group_id}
              onChange={(item) =>
                setDuplicateData({
                  ...duplicateData,
                  group_id: item,
                  pack_id: "",
                  lec_sub_id: "",
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="pack" className="animated-label">
              Enter Package
            </label>
            <Select
              id="pack"
              options={packages?.map((e) => ({
                value: e?.package_id,
                label: e?.name,
              }))}
              placeholder="Enter Package..."
              value={duplicateData?.pack_id}
              onChange={(item) =>
                setDuplicateData({
                  ...duplicateData,
                  pack_id: item,

                  lec_sub_id: "",
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="sub" className="animated-label">
              Enter Lectures
            </label>
            <Select
              id="sub"
              options={sub?.map((e) => ({
                value: e?.subject_id,
                label: e?.subject_name,
              }))}
              placeholder="Enter Lectures..."
              value={duplicateData?.lec_sub_id}
              onChange={(item) =>
                setDuplicateData({
                  ...duplicateData,
                  lec_sub_id: item,
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="lec" className="animated-label">
              Enter Days
            </label>
            <Select
              id="lec"
              isMulti
              options={lectures?.map((e) => ({
                value: e?.lec_id,
                label: e?.lec_title,
              }))}
              placeholder="Enter Days..."
              value={duplicateData?.lec_ids}
              onChange={(item) =>
                setDuplicateData({
                  ...duplicateData,
                  lec_ids: item,
                })
              }
            />
          </div>

          <div className="rowEndDiv">
            {duplicateData.loading ? (
              <Loader />
            ) : (
              <button
                type="submit"
                // onClick={() => duplicateVideo()}
                className="btn animated-btn btn-success"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </Modal>
      <></>
    </>
  );
}

export default Duplicate;
