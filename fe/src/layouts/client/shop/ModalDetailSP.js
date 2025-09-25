import { Button, Modal, Image, InputNumber } from "antd";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
// import { SanPhamClientAPI } from "../../../pages/censor/api/home/sanPham/sanPham.api";
import { GioHangAPI } from "../../../pages/api/client/gioHang/GioHangAPI";
import { get, set } from "local-storage";
import { useCart } from "../cart/CartContext";
// import { SanPhamAPI } from "../../../pages/censor/api/SanPham/sanPham.api";

const ModalDetailSP = (props) => {
  const { openModalDetailSP, setOpenModalDetailSP, idCt, setidCTSP } = props;
  const { updateTotalQuantity } = useCart();
  const [largeImage, setLargeImage] = useState("");
  const [ChiTietSanPham, setChiTietSanPham] = useState([]);
  const [selectedMauSac, setSelectedMauSac] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [IDSanPham, setIDSanPham] = useState("1");
  const [IDMauSac, setIDMauSac] = useState("1");
  const [IDSize, setIDSize] = useState("");
  const [soLuong, setSoLuong] = useState(1);
  const [khachHang, setKhachHang] = useState(null);
  const storedData = get("userData");
  const storedGioHang = get("GioHang");

  //Load ảnh lên Modal
  const [fileList, setFileList] = useState([]);
  const loadAnhCTSP = async () => {
    // SanPhamAPI.getAnhCTSPClient(IDMauSac, ChiTietSanPham.id).then((res) => {
    //   if (res.data && res.data.length > 0) {
    //     setLargeImage(res.data[0].url);
    //     const newFileList = res.data.map((anh, index) => ({
    //       uid: `${index}`,
    //       name: `Image-${index}`,
    //       status: "done",
    //       url: anh.url,
    //     }));
    //     setFileList(newFileList);
    //   } else {
    //   }
    // });
  };
  useEffect(() => {
    loadAnhCTSP();
  }, [IDMauSac, ChiTietSanPham.id]);

  const loadCountGioHang = () => {
    if (storedData != null) {
      GioHangAPI.getByIDKH(storedData.userID).then((res) => {
        GioHangAPI.getAllGHCTByIDGH(res.data.id).then((res) => {
          updateTotalQuantity(res.data.length);
        });
      });
    } else {
      if (storedGioHang != null) {
        GioHangAPI.getAllGHCTByIDGH(storedGioHang.id).then((res) => {
          updateTotalQuantity(res.data.length);
        });
      }
    }
  };

  useEffect(() => {
    loadCTSP();
    loadCountGioHang();
    if (storedData != null) {
      setKhachHang(storedData.userID);
    }
  }, []);

  const loadCTSP = () => {
    // SanPhamClientAPI.getCTSP(idCt).then((res) => {
    //   if (res.data === undefined || res.data === "") {
    //     return;
    //   }
    //   setChiTietSanPham(res.data);
    //   setIDSanPham(res.data.sanPhamID);
    //   setSelectedMauSac(res.data.mauSacID);
    //   setIDMauSac(res.data.mauSacID);
    //   setSelectedSize(res.data.kichThuocID);
    //   setIDSize(res.data.kichThuocID);
    //   loadListMauSacBySP(res.data.sanPhamID);
    //   loadListSizeBySP(res.data.sanPhamID);
    //   SanPhamClientAPI.changeListSizeBySPandMS(
    //     res.data.sanPhamID,
    //     res.data.mauSacID
    //   ).then((res) => {
    //     setListSizeByMS(res.data);
    //   });
    //   setLargeImage(res.data.anh);
    // });
  };
  const loadCTSPChange = (idSP, mauSelect, sizeSelect) => {
    if (idSP === "" || mauSelect === null || sizeSelect === null) {
      return;
    }
    // SanPhamClientAPI.getCTSPChange(idSP, mauSelect, sizeSelect).then((res) => {
    //   setChiTietSanPham(res.data);
    // });
  };
  const [ListMauSacBySP, setListMauSacBySP] = useState([]);
  const loadListMauSacBySP = (IDSP) => {
    // SanPhamClientAPI.getListMauSacBySP(IDSP).then((res) => {
    //   setListMauSacBySP(res.data);
    // });
  };
  const [ListSizeBySP, setListSizeBySP] = useState([]);
  const [ListSizeByMS, setListSizeByMS] = useState([]);
  const loadListSizeBySP = (IDSP) => {
    // SanPhamClientAPI.getListSizeBySP(IDSP).then((res) => {
    //   setListSizeBySP(res.data);
    // });
  };

  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false); // Đánh dấu đã render lần đầu
    } else {
      loadCTSPChange(IDSanPham, selectedMauSac, selectedSize);
    }
  }, [selectedMauSac, selectedSize]);

  const handleImageClick = (url) => {
    setLargeImage(url);
  };
  const handleClose = () => {
    loadCountGioHang();
    setOpenModalDetailSP(false);
    setidCTSP("");
  };
  const handleMauSacClick = (mauSacId) => {
    // Update the selected color when a button is clicked

    setIDMauSac(mauSacId);
    setSelectedMauSac(mauSacId);
    // SanPhamClientAPI.changeListSizeBySPandMS(IDSanPham, mauSacId).then(
    //   (res) => {
    //     setListSizeByMS(res.data);
    //     const kichThuocExists = res.data.some(
    //       (item) => item.kichThuocID === selectedSize
    //     );
    //     if (kichThuocExists) {
    //       setSelectedSize(selectedSize);
    //     } else {
    //       if (res.data != null) {
    //         setSelectedSize(res.data[0].kichThuocID);
    //       }
    //     }
    //   }
    // );
  };

  const handleSizeClick = (sizeId) => {
    setIDSize(sizeId);
    setSelectedSize(sizeId);
  };
  const handleAddGioHang = (ChiTietSanPham, soLuong, khachHang) => {
    let randomString = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    if (storedGioHang === null) {
      if (khachHang !== null) {
        GioHangAPI.getByIDKH(khachHang).then((res) => {
          if (res.data !== null && res.data !== "") {
            //nếu như tồn tại giỏ hàng của khách đăng nhập thì kiểm tra xem sp có trùng vs sp trong ghct đó k

            const idgh = res.data.id;

            GioHangAPI.getAllGHCTByIDGH(res.data.id).then((res) => {
              const idCTSP = res.data.filter(
                (item) => item.chiTietSanPham === ChiTietSanPham.id
              );
              if (idCTSP.length > 0) {
                const GHCT = {
                  id: idCTSP[0].id,
                  gioHang: idCTSP[0].gioHang,
                  chiTietSanPham: ChiTietSanPham.id,
                  soLuong: soLuong,
                  thanhTien: ChiTietSanPham.loaiKM
                    ? ChiTietSanPham.loaiKM === "Tiền mặt"
                      ? (ChiTietSanPham.giaBan -
                          ChiTietSanPham.giaTriKhuyenMai) *
                        soLuong
                      : (ChiTietSanPham.giaBan -
                          (ChiTietSanPham.giaBan *
                            ChiTietSanPham.giaTriKhuyenMai) /
                            100) *
                        soLuong
                    : ChiTietSanPham.giaBan * soLuong,
                };

                GioHangAPI.updateSLGHCT(GHCT).then((res) => {
                  toast("✔️ Thêm thành công!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  loadCountGioHang();
                });
              } else {
                const data = {
                  gioHang: idgh,
                  chiTietSanPham: ChiTietSanPham.id,
                  soLuong: soLuong,
                  thanhTien: ChiTietSanPham.loaiKM
                    ? ChiTietSanPham.loaiKM === "Tiền mặt"
                      ? (ChiTietSanPham.giaBan -
                          ChiTietSanPham.giaTriKhuyenMai) *
                        soLuong
                      : (ChiTietSanPham.giaBan -
                          (ChiTietSanPham.giaBan *
                            ChiTietSanPham.giaTriKhuyenMai) /
                            100) *
                        soLuong
                    : ChiTietSanPham.giaBan * soLuong,
                };

                GioHangAPI.addGHCT(data).then((res) => {
                  toast("✔️ Thêm thành công!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  loadCountGioHang();
                });
              }
            });
          } else {
            GioHangAPI.addGH({ ma: randomString, khachHang: khachHang }).then(
              (res) => {
                // set("GioHang", res.data);
                const data = {
                  gioHang: res.data.id,
                  chiTietSanPham: ChiTietSanPham.id,
                  soLuong: soLuong,
                  thanhTien: ChiTietSanPham.loaiKM
                    ? ChiTietSanPham.loaiKM === "Tiền mặt"
                      ? (ChiTietSanPham.giaBan -
                          ChiTietSanPham.giaTriKhuyenMai) *
                        soLuong
                      : (ChiTietSanPham.giaBan -
                          (ChiTietSanPham.giaBan *
                            ChiTietSanPham.giaTriKhuyenMai) /
                            100) *
                        soLuong
                    : ChiTietSanPham.giaBan * soLuong,
                };
                if (soLuong > ChiTietSanPham.soLuong) {
                  toast.error("Số lượng sản phẩm không đủ!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                } else {
                  GioHangAPI.addGHCT(data).then((res) => {
                    toast("✔️ Thêm thành công!", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    loadCountGioHang();
                  });
                }
              }
            );
          }
        });
      } else {
        GioHangAPI.addGH({ ma: randomString, khachHang: khachHang }).then(
          (res) => {
            set("GioHang", res.data);
            const data = {
              gioHang: res.data.id,
              chiTietSanPham: ChiTietSanPham.id,
              soLuong: soLuong,
              thanhTien: ChiTietSanPham.loaiKM
                ? ChiTietSanPham.loaiKM === "Tiền mặt"
                  ? (ChiTietSanPham.giaBan - ChiTietSanPham.giaTriKhuyenMai) *
                    soLuong
                  : (ChiTietSanPham.giaBan -
                      (ChiTietSanPham.giaBan * ChiTietSanPham.giaTriKhuyenMai) /
                        100) *
                    soLuong
                : ChiTietSanPham.giaBan * soLuong,
            };
            if (soLuong > ChiTietSanPham.soLuong) {
              toast.error("Số lượng sản phẩm không đủ!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } else {
              GioHangAPI.addGHCT(data).then((res) => {
                toast("✔️ Thêm thành công!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                loadCountGioHang();
              });
            }
          }
        );
      }
    } else {
      GioHangAPI.getAllGHCTByIDGH(storedGioHang.id).then((res) => {
        const idCTSP = res.data.filter(
          (item) => item.chiTietSanPham === ChiTietSanPham.id
        );

        if (idCTSP.length > 0) {
          const GHCT = {
            id: idCTSP[0].id,
            gioHang: res.data[0].gioHang,
            chiTietSanPham: ChiTietSanPham.id,
            soLuong: soLuong,
            thanhTien: ChiTietSanPham.loaiKM
              ? ChiTietSanPham.loaiKM === "Tiền mặt"
                ? (ChiTietSanPham.giaBan - ChiTietSanPham.giaTriKhuyenMai) *
                  soLuong
                : (ChiTietSanPham.giaBan -
                    (ChiTietSanPham.giaBan * ChiTietSanPham.giaTriKhuyenMai) /
                      100) *
                  soLuong
              : ChiTietSanPham.giaBan * soLuong,
          };

          GioHangAPI.updateSLGHCT(GHCT).then((res) => {
            toast("✔️ Thêm thành công!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            loadCountGioHang();
          });
        } else {
          const data = {
            gioHang: storedGioHang.id,
            chiTietSanPham: ChiTietSanPham.id,
            soLuong: soLuong,
            thanhTien: ChiTietSanPham.loaiKM
              ? ChiTietSanPham.loaiKM === "Tiền mặt"
                ? (ChiTietSanPham.giaBan - ChiTietSanPham.giaTriKhuyenMai) *
                  soLuong
                : (ChiTietSanPham.giaBan -
                    (ChiTietSanPham.giaBan * ChiTietSanPham.giaTriKhuyenMai) /
                      100) *
                  soLuong
              : ChiTietSanPham.giaBan * soLuong,
          };
          GioHangAPI.addGHCT(data).then((res) => {
            toast("✔️ Thêm thành công!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            loadCountGioHang();
          });
        }
      });
    }
  };

  return (
    <Modal
      //   title="Voucher"
      centered
      open={openModalDetailSP}
      onOk={handleClose}
      onCancel={handleClose}
      width={1000}
    >
      <div className="row">
        <div className="col-md-6 justify-content-center align-items-center">
          <div>
            <Image
              style={{ width: 450, height: 450 }}
              src={largeImage}
              alt="Large Product"
            />
          </div>
          <div className="row mt-2">
            {fileList.map((anh, index) => (
              <div className="col-md-3">
                <img
                  style={{ width: 90, height: 90, cursor: "pointer" }}
                  src={anh.url}
                  alt={anh.uuid}
                  onClick={() => handleImageClick(anh.url)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6 ">
          <h3>{ChiTietSanPham.tenSP}</h3>
          <h5 className="mb-3" style={{ color: "red" }}>
            {ChiTietSanPham.loaiKM ? (
              <span>
                <del style={{ color: "black" }}>
                  {Intl.NumberFormat("en-US").format(
                    roundToThousands(ChiTietSanPham.giaBan)
                  )}{" "}
                  VND{" "}
                </del>
                {Intl.NumberFormat("en-US").format(
                  roundToThousands(
                    ChiTietSanPham.loaiKM === "Tiền mặt"
                      ? ChiTietSanPham.giaBan - ChiTietSanPham.giaTriKhuyenMai
                      : ChiTietSanPham.giaBan -
                          (ChiTietSanPham.giaBan *
                            ChiTietSanPham.giaTriKhuyenMai) /
                            100
                  )
                )}{" "}
                VND
              </span>
            ) : (
              <span style={{ color: "black" }}>
                {Intl.NumberFormat("en-US").format(
                  roundToThousands(ChiTietSanPham.giaBan)
                )}{" "}
                VND
              </span>
            )}
          </h5>
          <hr></hr>
          <h6>Màu</h6>

          <div className="row">
            {ListMauSacBySP.map((listMauSacBySP, index) => (
              <div className="col-md-1" key={index}>
                <Button
                  className={`mt-1 `}
                  style={{
                    backgroundColor: listMauSacBySP.maMau, //`${listSanPham.tenMauSac}`
                    borderRadius: 40,
                    width: 30,
                    height: 30,
                    border:
                      selectedMauSac === listMauSacBySP.mauSacID
                        ? "2px solid #4096ff"
                        : "1px solid black",
                  }}
                  onClick={() => handleMauSacClick(listMauSacBySP.mauSacID)}
                ></Button>
              </div>
            ))}
          </div>
          <hr></hr>
          <h6>Size</h6>
          <div className="row mt-1">
            {ListSizeBySP.map((listsize, index) => (
              <div className="col-md-1 me-2" key={index}>
                <Button
                  className={`mt-2`}
                  style={{
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    textAlign: "center",
                    border:
                      selectedSize === listsize.kichThuocID
                        ? "1px solid #4096ff"
                        : "1px solid #d9d9d9",
                  }}
                  onClick={() => handleSizeClick(listsize.kichThuocID)}
                  disabled={
                    !ListSizeByMS.some(
                      (size) => size.kichThuocID === listsize.kichThuocID
                    )
                  }
                >
                  {listsize.tenKichThuoc}
                </Button>
              </div>
            ))}
          </div>
          <h6 className="mt-3">Số lượng</h6>
          <div className="row">
            <div className="col">
              <InputNumber
                min={1}
                max={ChiTietSanPham.soLuong}
                value={soLuong}
                onChange={(value) => setSoLuong(value)}
              />
            </div>
            <div className="col">{ChiTietSanPham.soLuong} sản phẩm có sẵn</div>
          </div>
          <Button
            className={`mt-3`}
            type="primary"
            onClick={() => handleAddGioHang(ChiTietSanPham, soLuong, khachHang)}
          >
            Thêm vào giỏ hàng
          </Button>
          <hr></hr>
          <h5>Mô tả sản phẩm:</h5>
          <p>
            <p>
              ●<span className="me-2 "></span>
              <label className="me-2 ">Tên hãng:</label>{" "}
              <span className="">{ChiTietSanPham.tenHang}</span>
            </p>
            <p>
              ●<span className="me-2"></span>Độ cao :{" "}
              <span>{ChiTietSanPham.tenDeGiay} cm </span>
            </p>
            <p>
              ●<span className="me-2"></span>Danh mục:{" "}
              <span>{ChiTietSanPham.tenDM}</span>
            </p>
            <p>
              ●<span className="me-2"></span>Chất liệu:{" "}
              <span>{ChiTietSanPham.tenCL}</span>
            </p>
            {ChiTietSanPham.moTa}
          </p>
        </div>
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
    </Modal>
  );
};
export default ModalDetailSP;
function roundToThousands(amount) {
  return Math.round(amount / 100) * 100;
}
