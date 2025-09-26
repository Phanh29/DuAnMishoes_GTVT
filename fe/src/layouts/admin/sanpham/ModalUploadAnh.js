import React, { useState, useEffect } from 'react';
import { Modal, Button, Upload, message, Checkbox } from 'antd';
import { CloudinaryContext, Image } from 'cloudinary-react';
import { CloudUploadOutlined, FileImageOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanPhamAPI } from '../api/SanPham/sanPham.api';
import axios from 'axios';


const CloudinaryUploader = ({ isOpenModal, isCancelModal, tenMau }) => {
  const CheckboxGroup = Checkbox.Group;
  const [listAnh, setListAnhs] = useState([]);
  const [selectedAnhs, setSelectedAnhs] = useState([]);
  //List Ảnh Theo Màu
  const loadAnh = async () => {
    SanPhamAPI.getAnhTheoMau(tenMau).then(response => {
      const data = response.data;
      setListAnhs(data);
    })
  };
  useEffect(() => {
    loadAnh();
  }, []);
  //Thêm ảnh vào database
  const addAnh = (value) => {
    SanPhamAPI.addAnhTheoMau(value)
      .then((res) => {
        loadAnh();
      })
  }
  //Chọn ảnh
  const handleSelectAnh = (anh) => {
    const isAlreadySelected = selectedAnhs.some(
      (selected) => selected.id === anh.id
    );
  
    if (isAlreadySelected) {
      // Nếu ảnh đã được chọn, xóa nó khỏi danh sách
      setSelectedAnhs(selectedAnhs.filter((selected) => selected.id !== anh.id));
    } else {
      // Nếu ảnh chưa được chọn, thêm nó vào danh sách
      setSelectedAnhs([...selectedAnhs, anh]);
    }
  };
  //Up ảnh lên cloud
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mishoes');
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dtetgawxc/image/upload',
        formData
      );

      const newAnh = {
        ten: tenMau,
        url: response.data.secure_url,
      };

      addAnh(newAnh)
      toast.success("Đã thêm ảnh mới", { autoClose: 2500 })
    } catch (error) {
      toast.error("Thêm ảnh mới thất bại", { autoClose: 2500 })
    }
  };
  //Cancel
  const handleCancelAnh = () => {
    isOpenModal=false;
  };

  const customRequest = async ({ file }) => {
    await handleUpload(file);
  };
  return (
    <>
      <Modal
        title={<span><FileImageOutlined /> Danh sách hình ảnh màu : {tenMau}</span>}
        width={700}
        height={700}
        open={isOpenModal}
        onOk={isCancelModal}
        onCancel={isCancelModal}
        footer={null}
      >
        <div className='text-end'>
          <Upload customRequest={customRequest} showUploadList={false}>
            <Button icon={<CloudUploadOutlined />} >Upload ảnh mới</Button>
          </Upload>
        </div>
        <div>
          <div className='mt-3'>
            <div className="row">
              {listAnh.map((item) => (
                <div
                  className="col-md-4 mt-3"
                  key={item.id}
                  onClick={() => handleSelectAnh(item)}
                >
                  <Image
                    cloudName="dtetgawxc"
                    publicId={item.url}
                    width="50"
                    height="50"
                    crop="fill"
                    style={{
                      border: selectedAnhs.some((selected) => selected.id === item.id) ? '2px solid black' : '2px solid gold',
                      borderRadius: '10px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CloudinaryUploader;
