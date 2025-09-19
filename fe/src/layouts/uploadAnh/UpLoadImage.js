import { Modal, Upload } from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import "./upLoadAnh.css";

export default function UpLoadImage({ onFileUpload, defaultImage }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  // load ảnh mặc định khi update
  useEffect(() => {
    if (defaultImage) {
      setFileList([
        {
          uid: "-1",
          name: "default.png",
          status: "done",
          url: defaultImage,
        },
      ]);
    }
  }, [defaultImage]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        file.preview = reader.result;
        setPreviewImage(file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || "Preview");
      };
    } else {
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
      setPreviewTitle(file.name || "Preview");
    }
  };

  const handleChange = ({ fileList: newList }) => {
    setFileList(newList);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "pcoffe_upload"); // preset cloudinary

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dm0w2qws8/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await res.json();
      if (json.secure_url) {
        onFileUpload(json.secure_url); // callback cho cha
      }
      onSuccess("OK");
    } catch (err) {
      onError(err);
    }
  };

  return (
    <>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        accept="image/*"
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={customRequest}
        className="custom-upload"
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
}
