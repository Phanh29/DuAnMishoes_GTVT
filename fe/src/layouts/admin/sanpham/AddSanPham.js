import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Radio,
  Divider,
  InputNumber,
  Modal,
  Table
} from "antd";
import { Link } from "react-router-dom";
import { MdAddTask, MdDelete } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import "./SanPham.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormItem from "antd/es/form/FormItem";
import {
  EditOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { keys } from "@antv/util";
import { App } from "antd";
import CloudinaryUpload from "./UpAnh";
import { useNavigate } from "react-router-dom";
import convert from "color-convert";
import "./SanPham.css";
import { ChiTietSanPhamAPI } from "../../../pages/api/sanpham/ChiTietSanPham.api";
import { ThuocTinhAPI } from "../../../pages/api/sanpham/ThuocTinhAPI";
import AddSanPhamModal from "./Modal/AddSanPhamModal";
import AddChatLieuModal from "./Modal/AddChatLieuModal";
import AddHangModal from "./Modal/AddHangModal";
import AddDoCaoModal from "./Modal/AddDoCaoModal";
import AddDanhMucModal from "./Modal/AddDanhMucModal";
import AddKichThuocModal from "./Modal/AddKichThuoc";
import AddMauSacModal from "./Modal/AddMauSac";
import UpdateNhanhModal from "./Modal/UpdateNhanhModal";
export default function AddSanPham() {
  //Form
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [formDG] = Form.useForm();
  const [formKT] = Form.useForm();
  const [form3] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState("1");
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  const { Option } = Select;
  const [componentSize, setComponentSize] = useState("default");
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const [openUpdateNhanh, setUpdateNhanhs] = useState(false);
  const [openAddAnh, setAddAnhs] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [dataKichThuoc, setDataKichThuocs] = useState([]);
  const [dataSanPham, setDataSanPhams] = useState([]);
  const [dataMauSac, setDataMauSacs] = useState([]);
  const [dataChatLieu, setDataChatLieus] = useState([]);
  const [dataHang, setDataHangs] = useState([]);
  const [dataDeGiay, setDataDeGiays] = useState([]);
  const [dataDanhMuc, setDataDanhMucs] = useState([]);
  const [dataMoTa, setDataMoTas] = useState([]);
  const [dataSoLuong, setDataSoLuong] = useState("");
  const [dataGiaBan, setDataGiaBan] = useState("");

  const handleDelete = (key) => {
    const updatedData = tableData.filter((item) => item.key !== key);
    setTableData(updatedData);
  };

  const handleLinkAnhChange = (linkAnhList, index) => {
    if (linkAnhList && linkAnhList.length > 0) {
      const updatedDataSource = tableData.map((item) => {
        if (item.tenMau === index || item.ghiChu === "") {
          // Cập nhật giá trị ghiChu với một mảng các liên kết
          return { ...item, ghiChu: linkAnhList[0], linkAnh: linkAnhList };
        }
        return item;
      });
      setTableData(updatedDataSource);
    }
  };

  const onChangeKT = (selectedOption) => {
    setDataKichThuocs(selectedOption);
  };
  const onChangeMS = (selectedOption) => {
    setDataMauSacs(selectedOption);
  };
  const onChangeCL = (selectedOption) => {
    setDataChatLieus(selectedOption);
  };
  const onChangeH = (selectedOption) => {
    setDataHangs(selectedOption);
  };
  const onChangeDG = (selectedOption) => {
    setDataDeGiays(selectedOption);
  };
  const onChangeDM = (selectedOption) => {
    setDataDanhMucs(selectedOption);
  };
  const onChangeMT = (e) => {
    setDataMoTas(e.target.value);
  };
  const onChangeSP = (selectedOption) => {
    setDataSanPhams(selectedOption);
  };
  const onChangeSL = (record, value) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => item.key === record.key);
    if (index > -1) {
      newData[index].soLuong = value;
      setTableData(newData);
    }
  };
  const onChangeGB = (record, value) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => item.key === record.key);
    if (index > -1) {
      newData[index].giaBan = value;
      setTableData(newData);
    }
  };
  const onChangeNhapGia = (event) => {
    setDataGiaBan(event);
  };
  const onChangeNhapSoLuong = (event) => {
    setDataSoLuong(event.target.value);
  };

  const loadDuLieuThem = () => {
    const newDataKT = ktData.filter((data) => dataKichThuoc.includes(data.ten));
    const newDataMS = msData.filter((data) => dataMauSac.includes(data.ma));
    const newDataCL = cl.filter((data) => dataChatLieu.includes(data.ten));
    const newDataH = h.filter((data) => dataHang.includes(data.ten));
    const newDataDG = dc.filter((data) => dataDeGiay.includes(data.ten));
    const newDataDM = dm.filter((data) => dataDanhMuc.includes(data.ten));
    const newDataSP = optionsSP.filter((data) =>
      dataSanPham.includes(data.ten)
    );

    if (dataKichThuoc.length > 0 && dataMauSac.length > 0) {
      if (
        newDataCL.length <= 0 ||
        newDataH.length <= 0 ||
        newDataDG.length <= 0 ||
        newDataDM.length <= 0 ||
        newDataSP.length <= 0 ||
        dataSoLuong === "" ||
        dataKichThuoc === ""
      ) {
        toast.error("Không để trống thông tin sản phẩm !", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        form.resetFields();
        setDataMauSacs([]);
        setDataKichThuocs([]);
        return;
      }

      let index = 1;
      const nameProduct = selectedValue;
      setTableData([]);
      for (let j = 0; j < newDataMS.length; j++) {
        for (let i = 0; i < newDataKT.length; i++) {
          const newSanPham = {
            key: `${newDataSP[0].ten} - ${newDataKT[i].ten} ${newDataMS[j].ten}`,
            tenCt: `${newDataSP[0].ten} - [${newDataKT[i].ten} ${newDataMS[j].ten}]`,
            maMau: newDataMS[j].ma,
            tenMau: newDataMS[j].ten,
            sanPham: newDataSP[0].id,
            moTa: dataMoTa,
            chatLieu: newDataCL[0].id,
            hang: newDataH[0].id,
            deGiay: newDataDG[0].id,
            danhMuc: newDataDM[0].id,
            mauSac: newDataMS[j].id,
            kichThuoc: newDataKT[i].id,
            linkAnh: null,
            ghiChu: null,
            soLuong: dataSoLuong,
            giaBan: dataGiaBan,
            stt: index++,
          };
          setTableData((prevData) => [...prevData, newSanPham]);
        }
      }
    } else {
      setTableData([]);
    }
  };
  const processColorGroups = () => {
    const colorGroups = {};
    tableData.forEach((item) => {
      if (!colorGroups[item.mauSac]) {
        colorGroups[item.mauSac] = [];
      }
      colorGroups[item.mauSac].push(item);
    });

    const processedData = [];
    Object.keys(colorGroups).forEach((color) => {
      const colorGroup = colorGroups[color];
      colorGroup.forEach((item, index) => {
        if (index === 0) {
          item.rowSpan = colorGroup.length;
        } else {
          item.rowSpan = 0;
        }
        processedData.push(item);
      });
    });

    return processedData;
  };
  const processedData = processColorGroups();

  const [colorGroups, setColorGroups] = useState([]);
  // Filter products based on color dynamically
  const filterProducts = () => {
    const groupedCTSP = tableData.reduce((groups, table) => {
      const mausac = table.tenMau;
      groups[mausac] = groups[mausac] || [];
      groups[mausac].push(table);
      return groups;
    }, {});
    setColorGroups(Object.entries(groupedCTSP));
  };

  const [selectedColor, setSelectedColor] = useState(null);
  const handleUploadAnh = (tenMau) => {
    setSelectedColor(tenMau);
    setAddAnhs(true);
  };

  useEffect(() => {
    filterProducts();
  }, [tableData]);

  useEffect(() => {
    loadDuLieuThem();
  }, [
    dataKichThuoc,
    dataMauSac,
    dataSoLuong,
    dataGiaBan,
    dataSanPham,
    dataMoTa,
    dataChatLieu,
    dataHang,
    dataDeGiay,
    dataDanhMuc,
  ]);

  //Update nhanh
  const updateNhanh = (newValues) => {
    if (selectedRowKeys.length <= 0) {
      toast.error("Chưa chọn dòng để sửa !", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      const updatedData = tableData.map((record) => {
        if (selectedRowKeys.includes(record.key)) {
          return {
            ...record,
            soLuong: newValues.soLuong,
            giaBan: newValues.giaBan,
          };
        }
        return record;
      });
      setTableData(updatedData);
      setSelectedRowKeys([]);
      form2.resetFields();
      setUpdateNhanhs(false);
      toast.success("Sửa thành công!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // Custom table
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //Load table
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "key",
      width: 10,
    },
    {
      title: "Tên",
      dataIndex: "tenCt",
      center: "true",
      width: 250,
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      width: 10,
      render: (_, record) => (
        <Input
          type="number"
          rules={[{ required: true, alert: "Không để trống số lượng" }]}
          min={1}
          style={{ width: 70 }}
          value={record.soLuong}
          onChange={(e) => onChangeSL(record, e.target.value)}
        />
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "giaBan",
      width: 10,
      render: (_, record) => {
        return (
          <>
            <InputNumber
              min={100000}
              formatter={(value) =>
                `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\VND\s?|(,*)/g, "")}
              style={{ width: 150 }}
              value={record.giaBan}
              onChange={(e) => onChangeGB(record, e)}
            ></InputNumber>
          </>
        );
      },
    },
    {
      title: "Màu",
      dataIndex: "maMau",
      width: 10,
      render: (_, record) => {
        return (
          <>
            <div
              className="custom-div"
              style={{
                backgroundColor: record.maMau,
                borderRadius: 6,
                width: 60,
                height: 25,
              }}
            ></div>
          </>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "ghiChu",
      width: 100,
      render: (_, record) => {
        return (
          <>
            <Button
              onClick={() => handleDelete(record.key)}
              style={{
                height: 50,
                backgroundColor: "red",
                color: "white",
                borderRadius: 5,
              }}
            >
              <MdDelete size={30} />
            </Button>
          </>
        );
      },
    },
    {
      title: "Upload ảnh",
      dataIndex: "tenMau",
      width: 400,
      render: (_, record) => {
        return {
          children: (
            <CloudinaryUpload
              linkAnhList={record.linkAnh || []} // truyền dữ liệu từ tableData xuống
              onLinkAnhChange={(linkAnhList) =>
                handleLinkAnhChange(linkAnhList, record.tenMau)
              }
            />
          ),
          props: {
            rowSpan: record.rowSpan,
            style: {
              justifyContent: "center",
              alignItems: "center",
            },
          },
        };
      },
    },
  ];

  //CTSP
  const [optionsCTSP, setOptionsCTSP] = useState([]);
  useEffect(() => {
    loadCTSP();
  }, []);
  const loadCTSP = () => {
    ChiTietSanPhamAPI.showCTSP().then((response) => {
      setOptionsCTSP(response.data);
    });
  };

  const addCTSanPham = () => {
    const chekTrung = (code) => {
      return optionsCTSP.some((ctsp) => ctsp.tenCt === code);
    };

    for (let i = 0; i < tableData.length; i++) {
      if (chekTrung(tableData[i].tenCt)) {
        toast.error('Sản phẩm "' + tableData[i].tenCt + '" đã tồn tại', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].soLuong === "" || tableData[i].soLuong < 1) {
        toast.error("Không để trống số lượng ! ( Số lượng >= 1 )", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].giaBan === "" || tableData[i].giaBan < 100000) {
        toast.error("Không để trống giá bán ! ( Giá bán >= 100,000 )", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].moTa.length > 200) {
        toast.error("Mô tả không quá 200 kí tự!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].ghiChu == null) {
        toast.error("Không để trống ảnh!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    const promises = [];
    for (let i = 0; i < tableData.length; i++) {
      promises.push(ChiTietSanPhamAPI.createCTSP(tableData[i]));
    }
    Promise.all(promises)
      .then(() => {
        loadCTSP();
        form1.resetFields();
        form.resetFields();
        setTableData([]);
        nav("/admin-san-pham");
        toast.success("Thêm thành công!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log(tableData)
  };

  //Load san pham
  const [openSP, setOpenSP] = useState(false);
  const [optionsSP, setOptionsSP] = useState([]);
  useEffect(() => {
    loadSP();
  }, []);
  const loadSP = async () => {
    ThuocTinhAPI.getAllSanPhamForAdd().then((response) => {
      setOptionsSP(response.data);
    });
  };
  //Load Kích Thước
  const [openKT, setOpenKT] = useState(false);
  const [ktData, setKTData] = useState([]);
  useEffect(() => {
    loadKT();
  }, []);
  const loadKT = async () => {
    ThuocTinhAPI.getAll("kich-thuoc").then((response) => {
      const data = response.data;
      setKTData(data);
    });
  };
  // Load Màu Sắc
  const [openMS, setOpenMS] = useState(false);
  const [msData, setMSData] = useState([]);
  useEffect(() => {
    loadMS();
  }, []);
  const loadMS = async () => {
    ThuocTinhAPI.getAll("mau-sac").then((response) => {
      const data = response.data;
      setMSData(data);
    });
  };

  // Load Chất Liệu
  const [openCL, setOpenCL] = useState(false);
  const [cl, setCL] = useState([]);
  useEffect(() => {
    loadCL();
  }, []);
  const loadCL = async () => {
    ThuocTinhAPI.getAll("chat-lieu").then((response) => {
      const data = response.data;
      setCL(data);
    });
  };

  // Load Độ Cao
  const [openDC, setOpenDC] = useState(false);
  const [dc, setDC] = useState([]);

  useEffect(() => {
    loadDC();
  }, []);
  const loadDC = async () => {
    ThuocTinhAPI.getAll("de-giay").then((response) => {
      const data = response.data;
      setDC(data);
    });
  };

  // Load Danh Mục
  const [openDM, setOpenDM] = useState(false);
  const [dm, setDM] = useState([]);
  useEffect(() => {
    loadDM();
  }, []);
  const loadDM = async () => {
    ThuocTinhAPI.getAll("danh-muc").then((response) => {
      const data = response.data;
      setDM(data);
    });
  };
 
  // Load Hãng
  const [openH, setOpenH] = useState(false);
  const [h, setH] = useState([]);
  useEffect(() => {
    loadH();
  }, []);
  const loadH = async () => {
    ThuocTinhAPI.getAll("hang").then((response) => {
      const data = response.data;
      setH(data);
    });
  };


  const validateSoLuong = (_, value) => {
    const { getFieldValue } = form;
    const soLuongBanDau = getFieldValue("soLuong");

    if (!soLuongBanDau.trim()) {
      return Promise.reject("Số lượng không được để trống");
    }

    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(soLuongBanDau)) {
      return Promise.reject("Số lượng không được chứa ký tự đặc biệt");
    }

    const soLuong = parseInt(value);
    if (isNaN(soLuong) || soLuong < 1) {
      return Promise.reject("Số lượng phải là số nguyên lớn hơn 1");
    }

    return Promise.resolve();
  };

  const validateGiaBan = (_, value) => {
    const { getFieldValue } = form;
    const check = getFieldValue("giaBan");

    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(check)) {
      return Promise.reject("Giá bán không được chứa ký tự đặc biệt");
    }

    if (isNaN(value) || value < 100000) {
      return Promise.reject("Giá bán phải là số nguyên lớn hơn 100.000");
    }

    return Promise.resolve();
  };

  //Hiển Thị
  return (
    <div className="container-fluid" style={{ borderRadius: 20 }}>
      <div className="container-fluid">
        <Divider orientation="center" color="#d0aa73">
          <h4 className="text-first pt-1 fw-bold">
            {" "}
            <PlusCircleOutlined size={35} /> Thêm sản phẩm
          </h4>
        </Divider>
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          initialValues={{
            size: componentSize,
          }}
          onValuesChange={onFormLayoutChange}
          size={componentSize}
          form={form}
          onFinish={addCTSanPham}
        >
          <div>
            {/* Sản Phẩm */}
            <div
              className=" bg-light m-2 p-3 pt-2"
              style={{
                border: "1px solid #ddd", // Border color
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                borderRadius: "8px",
              }}
            >
              <h5>
                <IoIosAddCircleOutline size={30} /> Thông tin sản phẩm
              </h5>
              <hr />
              {/* Sản Phẩm  */}
              <div className="row">
                <Form.Item
                  className="col"
                  style={{ paddingLeft: 150 }}
                  name="sanPham"
                  label={<b>Tên Sản Phẩm </b>}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không để trống tên sản phẩm!",
                    },
                  ]}
                >
                  <Select
                    onChange={onChangeSP}
                    placeholder="Chọn một giá trị"
                    style={{ height: 40, width: 613 }}
                    showSearch
                    className="me-1"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {optionsSP.map((item) => (
                      <Select.Option key={item.id} value={item.ten}>
                        {item.ten}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item className="col mt-1" style={{ paddingLeft: 140 }}>
                  <Button
                    className="bg-success text-white"
                    onClick={() => setOpenSP(true)}
                    icon={<PlusCircleOutlined />}
                  ></Button>
                  <AddSanPhamModal
                    open={openSP}
                    onClose={() => setOpenSP(false)}
                    form={form1}
                    componentSize={componentSize}
                    onFormLayoutChange={onFormLayoutChange}
                    loadSP={loadSP}
                    optionsSP={optionsSP}
                  />
                </Form.Item>
              </div>
              {/* Mô Tả */}
              <Form.Item
                name="moTa"
                label={<b>Mô tả </b>}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng không để trống mô tả!" },
                ]}
              >
                <TextArea
                  style={{ width: 613, marginLeft: 10 }}
                  rows={5}
                  maxLength={200}
                  value={dataMoTa}
                  onChange={onChangeMT}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </Form.Item>
              {/* Chất liệu & Hãng */}
              <div className="row">
                <div className="col-md-6">
                  {/* Chất Liệu */}
                  <div className="row">
                    <Form.Item
                      className="col-md-10"
                      style={{ paddingLeft: 87 }}
                      name="chatLieu"
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng không để trống chất liệu !",
                        },
                      ]}
                      label={<b>Chất liệu </b>}
                    >
                      <Select
                        placeholder="Chọn một giá trị"
                        style={{ width: 307 }}
                        onChange={onChangeCL}
                      >
                        {cl.map((item) => (
                          <Select.Option key={item.id} value={item.ten}>
                            {item.ten}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item className="col-md-2">
                      <Button
                        className="bg-success text-white"
                        onClick={() => setOpenCL(true)}
                        icon={<PlusCircleOutlined />}
                      ></Button>
                      <AddChatLieuModal
                        open={openCL}
                        onClose={() => setOpenCL(false)}
                        form={form1}
                        componentSize={componentSize}
                        onFormLayoutChange={onFormLayoutChange}
                        cl={cl}
                        loadCL={loadCL}
                      />
                    </Form.Item>
                  </div>
                </div>
                {/* Hãng */}
                <div className="col-md-6">
                  <div className="row">
                    <Form.Item
                      className="col-md-8"
                      style={{ paddingLeft: 54 }}
                      name="hang"
                      label={<b>Hãng </b>}
                      hasFeedback
                      rules={[{ required: true, message: "" }]}
                    >
                      <Select
                        placeholder="Chọn một giá trị"
                        style={{ width: 307 }}
                        onChange={onChangeH}
                      >
                        {h.map((item) => (
                          <Select.Option key={item.id} value={item.ten}>
                            {item.ten}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item className="col-md-4" style={{ paddingLeft: 62 }}>
                      <Button
                        className="bg-success text-white"
                        onClick={() => setOpenH(true)}
                        icon={<PlusCircleOutlined />}
                      ></Button>
                      <AddHangModal
                        open={openH}
                        onClose={() => setOpenH(false)}
                        form={form1}
                        componentSize={componentSize}
                        onFormLayoutChange={onFormLayoutChange}
                        h={h}
                        loadH={loadH}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              {/* Đế giày & Danh mục */}
              {/* Đế giày*/}
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <Form.Item
                      className="col-md-10"
                      style={{ paddingLeft: 87 }}
                      name="deGiay"
                      label={<b>Đế giày </b>}
                      hasFeedback
                      rules={[{ required: true, message: "" }]}
                    >
                      <Select
                        placeholder="Chọn một giá trị"
                        style={{ width: 307 }}
                        className="me-2"
                        onChange={onChangeDG}
                      >
                        {dc.map((item) => (
                          <Select.Option key={item.id} value={item.ten}>
                            {item.ten}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item className="col-md-2">
                      <Button
                        className="bg-success text-white"
                        onClick={() => setOpenDC(true)}
                        icon={<PlusCircleOutlined />}
                      ></Button>
                      <AddDoCaoModal
                        open={openDC}
                        onClose={() => setOpenDC(false)}
                        form={formDG}
                        componentSize={componentSize}
                        onFormLayoutChange={onFormLayoutChange}
                        dc={dc}
                        loadDC={loadDC}
                      />
                    </Form.Item>
                  </div>
                </div>
                {/* Danh mục */}
                <div className="col-md-6">
                  <div className="row">
                    <Form.Item
                      className="col-md-9"
                      style={{ paddingLeft: 39 }}
                      name="danhMuc"
                      label={<b>Danh mục</b>}
                      hasFeedback
                      rules={[{ required: true, message: "" }]}
                    >
                      <Select
                        placeholder="Chọn một giá trị"
                        style={{ width: 307 }}
                        className="me-2"
                        onChange={onChangeDM}
                      >
                        {dm.map((item) => (
                          <Select.Option key={item.id} value={item.ten}>
                            {item.ten}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item className="col-md-3">
                      <Button
                        className="bg-success text-white w-1"
                        onClick={() => setOpenDM(true)}
                        icon={<PlusCircleOutlined />}
                      ></Button>
                      <AddDanhMucModal
                        open={openDM}
                        onClose={() => setOpenDM(false)}
                        form={form1}
                        componentSize={componentSize}
                        onFormLayoutChange={onFormLayoutChange}
                        dm={dm}
                        loadDM={loadDM}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            {/* Số lượng và giá bán */}
            <div
              className=" bg-light m-2 p-3 pt-2"
              style={{
                border: "1px solid #ddd", // Border color
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                borderRadius: "8px",
              }}
            >
              <h5>
                <MdAddTask size={30} /> Số lượng & giá bán ban đầu
              </h5>
              <hr />
              <div className="row">
                <div className="col-md-6">
                  <Form.Item
                    label={<b>Số lượng </b>}
                    name="soLuong"
                    style={{ paddingLeft: 45 }}
                    hasFeedback
                    rules={[{ validator: validateSoLuong }]}
                  >
                    <Input
                      onChange={onChangeNhapSoLuong}
                      style={{ width: 307 }}
                      placeholder="Nhập số lượng sản phẩm"
                      type="number"
                      min={1}
                      className="border"
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={<b>Giá bán </b>}
                    name="giaBan"
                    style={{ paddingRight: 60 }}
                    hasFeedback
                    rules={[{ validator: validateGiaBan }]}
                  >
                    <InputNumber
                      className="border-warning"
                      min={100000}
                      formatter={(value) =>
                        `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\VND\s?|(,*)/g, "")}
                      style={{ width: 307 }}
                      onChange={onChangeNhapGia}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            {/* Kích thước và màu sắc */}
            <div
              className=" bg-light m-2 p-3 pt-2"
              style={{
                border: "1px solid #ddd", // Border color
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                borderRadius: "8px",
              }}
            >
              <h5>
                <MdAddTask size={30} /> Kích thước và màu sắc
              </h5>
              <hr />
              {/* Kích Thước */}
              <div className="row" style={{ paddingLeft: 150 }}>
                <div className="col">
                  <Form.Item
                    label={<b>Kích thước </b>}
                    name="kichThuoc"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng không để trống kích thước!",
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: 613,
                        height: "50px",
                      }}
                      mode="multiple"
                      placeholder="Chọn một giá trị"
                      className="me-2"
                      onChange={onChangeKT}
                    >
                      {ktData.map((item) => (
                        <Select.Option key={item.id} value={item.ten}>
                          {item.ten}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div
                  className="col"
                  style={{ paddingLeft: 137, paddingTop: 10 }}
                >
                  <Form.Item>
                    <Button
                      className="bg-success text-white w-1"
                      onClick={() => setOpenKT(true)}
                      icon={<PlusCircleOutlined />}
                    ></Button>
                    <AddKichThuocModal
                      open={openKT}
                      onClose={() => setOpenKT(false)}
                      form={formKT}
                      componentSize={componentSize}
                      onFormLayoutChange={onFormLayoutChange}
                      ktData={ktData}
                      loadKT={loadKT}
                    />
                    <br />
                  </Form.Item>
                </div>
              </div>
              {/* Màu Sắc */}
              <div className="row" style={{ paddingLeft: 150 }}>
                <div className="col">
                  <Form.Item
                    label={<b>Màu sắc </b>}
                    name="mauSac"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng không để trống màu sắc!",
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: 613,
                        height: 50,
                      }}
                      mode="multiple"
                      placeholder="Chọn một giá trị"
                      className="me-2"
                      onChange={onChangeMS}
                    >
                      {msData.map((item) => (
                        <Select.Option key={item.id} value={item.ma}>
                          <div
                            style={{
                              backgroundColor: `${item.ma}`,
                              borderRadius: 6,
                              width: 60,
                              height: 22,
                            }}
                            className="custom-div"
                          >
                            {item.ten}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div
                  className="col"
                  style={{ paddingLeft: 137, paddingTop: 10 }}
                >
                  <Form.Item>
                    <Button
                      className="bg-success text-white w-1"
                      onClick={() => setOpenMS(true)}
                      icon={<PlusCircleOutlined />}
                    ></Button>
                    <AddMauSacModal
                      open={openMS}
                      onClose={() => setOpenMS(false)}
                      form={form3}
                      componentSize={componentSize}
                      onFormLayoutChange={onFormLayoutChange}
                      formItemLayout={formItemLayout}
                      msData={msData}
                      loadMS={loadMS}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Table */}
            <div
              className=" bg-light m-2 p-3 pt-2"
              style={{
                border: "1px solid #ddd", // Border color
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                borderRadius: "8px",
              }}
            >
              <h5>
                <InfoCircleOutlined size={30} /> Chi tiết sản phẩm
              </h5>
              <hr />
              <div className="text-end mb-3">
                {/* <Button
                  icon={<FileImageOutlined />}
                  onClick={() => {
                    setAddAnhs(true);
                  }}
                  style={{ backgroundColor: "#0A1172", color: "white" }}
                >
                  Upload Ảnh
                </Button> */}

                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setUpdateNhanhs(true);
                  }}
                  style={{ backgroundColor: "#0A1172", color: "white" }}
                >
                  Sửa nhanh số lượng & giá bán
                </Button>
                <UpdateNhanhModal
                  open={openUpdateNhanh}
                  onClose={() => setUpdateNhanhs(false)}
                  form={form2}
                  updateNhanh={updateNhanh}
                  componentSize={componentSize}
                  onFormLayoutChange={onFormLayoutChange}
                  formItemLayout={formItemLayout}
                />
              </div>
              <Table
                dataSource={processedData}
                rowKey={"key"}
                columns={columns}
                rowSelection={rowSelection}
              ></Table>
              <div className="text-end mt-3">
                <Form.Item>
                  <Link
                    className="btn btn-outline-success ms-3 me-2"
                    style={{ height: 31, fontSize: 14, paddingBottom: 30 }}
                    to="/admin-san-pham"
                  >
                    Hủy
                  </Link>
                  <Button
                    style={{ height: 41 }}
                    className="bg-success text-white"
                    onClick={() => {
                      Modal.confirm({
                        centered: "true",
                        title: "Thông báo",
                        content: "Bạn có chắc chắn muốn thêm không?",
                        onOk: () => {
                          form.submit();
                        },
                        footer: (_, { OkBtn, CancelBtn }) => (
                          <>
                            <CancelBtn />
                            <OkBtn />
                          </>
                        ),
                      });
                    }}
                  >
                    {" "}
                    Thêm Sản Phẩm
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
