import React, { useState,useEffect } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './SanPham.css'
const CloudinaryUpload = ({ linkAnhList = [], onLinkAnhChange }) => {
  const [localList, setLocalList] = useState(linkAnhList);

  useEffect(() => {
    setLocalList(linkAnhList); // đồng bộ khi tableData thay đổi
  }, [linkAnhList]);

  const beforeUpload = (file, fileList) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== "png") {
      message.error("Chỉ được upload .png");
      return false;
    }
    if (localList.length + fileList.length > 5) {
      message.error("Tối đa 5 ảnh");
      return false;
    }
    return true;
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "mishoes");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dtetgawxc/image/upload",
        formData
      );

      const newList = [...localList, res.data.secure_url];
      setLocalList(newList);
      onLinkAnhChange(newList); // update tableData
      onSuccess();
    } catch (err) {
      onError();
      message.error("Upload thất bại");
    }
  };

  return (
    <>
      <Upload
        customRequest={customRequest}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        multiple
        className="text-center"
      >
        {localList.length < 5 && (
          <div>
            <PlusOutlined style={{ fontSize: "32px", color: "#999" }} />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>

      <div style={{ display: "flex", gap: "10px" }}>
        {localList.map((link, index) => (
          <img
            key={index}
            src={link}
            alt={`Ảnh ${index}`}
            width={90}
            height={90}
            style={{
              border: "1px solid black",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        ))}
      </div>
    </>
  );
};
export default CloudinaryUpload;