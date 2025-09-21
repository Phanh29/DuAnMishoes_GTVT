import React, { useState, useEffect } from 'react';
import { DeleteFilled, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, Modal, Upload, message } from 'antd';
import { SanPhamAPI } from '../../../pages/api/sanpham/sanPham.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const SuaAnhCTSP = ({ ten, idSP }) => {

  const [linkAnhList, setLinkAnhList] = useState([]);
  const loadAnhCTSP = async () => {
    SanPhamAPI.getAnhCTSP(ten, idSP)
      .then((res) => {
        setLinkAnhList(res.data);
      })
  };

  const deleteAnhCTSP = async (idAnh) => {
    try {
      await SanPhamAPI.deleteAnh(idAnh);
      setLinkAnhList((prevList) => prevList.filter((linkAnh) => linkAnh.id !== idAnh));
      message.success('Ảnh đã được xóa thành công.');
    } catch (error) {
      message.error('Xóa ảnh thất bại. Hãy thử lại.');
    }
  };

  const confirmDelete = (idAnh) => {
    Modal.confirm({
      centered: true,
      title: 'Xác nhận xóa ảnh',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa ảnh này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => deleteAnhCTSP(idAnh), // Xóa khi xác nhận
    });
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    const idAnh = e.currentTarget.dataset.id;
    confirmDelete(idAnh); // Hiển thị Modal xác nhận trước khi xóa
  };

  console.log(linkAnhList)
  useEffect(() => {
    loadAnhCTSP();
  }, [ten, idSP]);

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      // Gửi file lên Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'mishoes');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dtetgawxc/image/upload',
        formData
      );
      const imageUrl = response.data.secure_url;
      const imageObject = {
        ten: ten,
        url: imageUrl
      };
      SanPhamAPI.addAnhTheoMau(idSP, imageObject)
        .then((res) => {
          setLinkAnhList((prevData) => [...prevData, res.data])
          toast('✔️ Thêm ảnh mới thành công!', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
      onSuccess();
    } catch (error) {
      onError();
      message.error('Đã xảy ra lỗi trong quá trình upload.');
    }
  };

  const beforeUpload = (file, fileList) => {
    // Kiểm tra định dạng tệp (chỉ cho phép .png)
    const allowedFormat = '.png';
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension !== allowedFormat.replace('.', '')) {
      message.error('Bạn chỉ có thể tải lên các tệp .png.');
      return false; // Ngăn chặn việc tải lên
    }

    // Kiểm tra tổng số tệp để không vượt quá giới hạn
    if (linkAnhList.length + fileList.length > 5) {
      message.error('Bạn chỉ có thể tải lên tối đa 5 ảnh.');
      return false; // Ngăn chặn việc tải lên thêm
    }

    return true; // Cho phép tải lên nếu điều kiện thỏa mãn
  };
  const hasEmptySlot = linkAnhList.length < 5;
  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {linkAnhList.map((linkAnh, index) => (
            <div className="row ms-2">
              <div
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  border: "1px solid black",
                  borderRadius: "10px",
                  objectFit: "cover",
                  marginBottom: 20
                }}
              >
                <Image
                  className='mt-2'
                  key={index}
                  src={linkAnh.url}
                  alt={`Ảnh ${index}`}
                  width={100.4}
                  height={100.4}
                />
                <a
                  className="btn btn-danger mt-1 mb-1"
                  style={{ border: 'none', borderRadius: '50px', color: 'black', backgroundColor: 'white' }}
                  onClick={handleLinkClick}
                  data-id={linkAnh.id} // Giữ ID của ảnh để dễ xóa
                >
                  <DeleteFilled size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <Upload
          className='ms-2 mt-4'
          customRequest={customRequest}
          listType="picture-card"
          showUploadList={false}
          beforeUpload={beforeUpload}
          multiple={true} // Cho phép tải lên nhiều hình ảnh
          maxCount={4}
        >
          {hasEmptySlot && ( // Hiển thị ô upload chỉ khi có ít hơn 3 ảnh
            <div>
              <PlusOutlined style={{ fontSize: "32px", color: "#999" }} />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
};
export default SuaAnhCTSP;