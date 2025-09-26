import { Button, Modal, Image, InputNumber } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { HomeAPI } from "../../../pages/api/client/HomeAPI";
import { GioHangAPI } from "../../../pages/api/client/gioHang/GioHangAPI";
import { get } from "local-storage";
import { useCart } from "../cart/CartContext";

const ModalDetailSP = ({
  openModalDetailSP,
  setOpenModalDetailSP,
  idCt,
  setidCTSP,
}) => {
  const { updateTotalQuantity } = useCart();

  const [productDetail, setProductDetail] = useState(null);
  const [largeImage, setLargeImage] = useState("");
  const [selectedMauSac, setSelectedMauSac] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [soLuong, setSoLuong] = useState(1);
  const [khachHang, setKhachHang] = useState(null);

  const storedData = get("userData");
  const storedGioHang = get("GioHang");

  const loadProductDetail = async () => {
    if (!idCt) return;
    try {
      const res = await HomeAPI.getProductDetailByCtsp(idCt);
      setProductDetail(res.data);

      if (res.data.colors?.length > 0) {
        setSelectedMauSac(res.data.colors[0].id);
        if (res.data.colors[0].images?.length > 0) {
          setLargeImage(res.data.colors[0].images[0]);
        }
      }
      if (res.data.sizes?.length > 0) {
        setSelectedSize(res.data.sizes[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadCountGioHang = async () => {
    if (storedData) {
      const res = await GioHangAPI.getByIDKH(storedData.userID);
      if (res.data) {
        const resGH = await GioHangAPI.getAllGHCTByIDGH(res.data.id);
        updateTotalQuantity(resGH.data.length);
      }
    } else if (storedGioHang) {
      const resGH = await GioHangAPI.getAllGHCTByIDGH(storedGioHang.id);
      updateTotalQuantity(resGH.data.length);
    }
  };

  useEffect(() => {
    loadProductDetail();
    loadCountGioHang();
    if (storedData) setKhachHang(storedData.userID);
  }, [idCt]);

  /** Tìm variant theo màu + size */
  const selectedVariant = useMemo(() => {
    if (!productDetail?.variants || !selectedMauSac || !selectedSize)
      return null;
    return (
      productDetail.variants.find(
        (v) => v.mauSacId === selectedMauSac && v.sizeId === selectedSize
      ) || null
    );
  }, [productDetail, selectedMauSac, selectedSize]);

  const handleImageClick = (url) => setLargeImage(url);

  const handleClose = () => {
    loadCountGioHang();
    setOpenModalDetailSP(false);
    setidCTSP("");
  };

  const handleAddGioHang = () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn màu & size hợp lệ!");
      return;
    }
    if (soLuong > (selectedVariant.soLuong || 0)) {
      toast.error("Số lượng sản phẩm không đủ!");
      return;
    }
    console.log(
      "[ModalDetailSP] Thêm vào giỏ: CTSP ID =",
      selectedVariant.id,
      "Số lượng =",
      soLuong
    );
    // TODO: gọi API add giỏ hàng
    toast("✔️ Thêm thành công!", { position: "top-right" });
  };

  if (!productDetail) return null;

  /** Giá hiển thị */
  const basePrice =
    selectedVariant?.giaBan ?? productDetail.variants?.[0]?.giaBan ?? 0;
  const km = selectedVariant?.khuyenMai;
  const finalPrice = km
    ? km.loai === "Tiền mặt"
      ? basePrice - (km.giaTri || 0)
      : basePrice - (basePrice * (km.giaTri || 0)) / 100
    : basePrice;

  return (
    <Modal
      centered
      open={openModalDetailSP}
      onOk={handleClose}
      onCancel={handleClose}
      width={1000}
    >
      <div className="row">
        {/* Left: ảnh */}
        <div className="col-md-6 text-center">
          <Image
            style={{ width: 450, height: 450 }}
            src={largeImage}
            alt="Large Product"
          />
          <div className="row mt-2">
            {productDetail.colors
              ?.find((c) => c.id === selectedMauSac)
              ?.images?.map((url, i) => (
                <div className="col-md-3" key={i}>
                  <img
                    style={{ width: 90, height: 90, cursor: "pointer" }}
                    src={url}
                    alt={`thumb-${i}`}
                    onClick={() => handleImageClick(url)}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Right: info */}
        <div className="col-md-6">
          <h3>{productDetail.ten}</h3>

          <h5 style={{ color: "red" }}>
            {km ? (
              <>
                <del style={{ color: "black" }}>
                  {Intl.NumberFormat("en-US").format(basePrice)} VND
                </del>{" "}
                {Intl.NumberFormat("en-US").format(finalPrice)} VND
              </>
            ) : (
              <span style={{ color: "black" }}>
                {Intl.NumberFormat("en-US").format(basePrice)} VND
              </span>
            )}
          </h5>

          <hr />
          <h6>Màu</h6>
          <div className="row">
            {productDetail.colors?.map((c) => {
              const coHang = productDetail.variants?.some(
                (v) => v.mauSacId === c.id && v.soLuong > 0
              );
              return (
                <div className="col-md-1" key={c.id}>
                  <Button
                    style={{
                      backgroundColor: c.ma,
                      borderRadius: 40,
                      width: 30,
                      height: 30,
                      border:
                        selectedMauSac === c.id
                          ? "2px solid #4096ff"
                          : "1px solid black",
                    }}
                    disabled={!coHang} // disable nếu hết hàng toàn bộ size
                    onClick={() => {
                      setSelectedMauSac(c.id);
                      if (c.images?.length > 0) setLargeImage(c.images[0]);
                    }}
                  />
                </div>
              );
            })}
          </div>

          <hr />
          <h6>Size</h6>
          <div className="row">
            {productDetail.sizes?.map((s) => {
              const variant = productDetail.variants?.find(
                (v) => v.mauSacId === selectedMauSac && v.sizeId === s.id
              );
              const hetHang = !variant || variant.soLuong <= 0;
              return (
                <div className="col-md-1 me-2" key={s.id}>
                  <Button
                    style={{
                      borderRadius: 10,
                      width: 40,
                      height: 40,
                      border:
                        selectedSize === s.id
                          ? "1px solid #4096ff"
                          : "1px solid #d9d9d9",
                    }}
                    disabled={hetHang} // disable nếu hết hàng
                    onClick={() => setSelectedSize(s.id)}
                  >
                    {s.ten}
                  </Button>
                </div>
              );
            })}
          </div>

          <h6 className="mt-3">Số lượng</h6>
          <div className="row">
            <div className="col">
              <InputNumber
                min={1}
                max={selectedVariant?.soLuong || 1}
                value={soLuong}
                onChange={(val) => setSoLuong(val)}
              />
            </div>
            <div className="col">
              {selectedVariant?.soLuong ?? 0} sản phẩm có sẵn
            </div>
          </div>

          <Button className="mt-3" type="primary" onClick={handleAddGioHang}>
            Thêm vào giỏ hàng
          </Button>

          <hr />
          <h5>Mô tả sản phẩm:</h5>
          <p>
            ● Tên hãng: {productDetail.tenHang} <br />● Độ cao:{" "}
            {productDetail.tenDeGiay} cm <br />● Danh mục: {productDetail.tenDM}{" "}
            <br />● Chất liệu: {productDetail.tenCL} <br />
            {productDetail.moTa}
          </p>
        </div>
      </div>

      <ToastContainer />
    </Modal>
  );
};

export default ModalDetailSP;
