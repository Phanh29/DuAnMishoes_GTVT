import { Button, Modal, Image, InputNumber } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { HomeAPI } from "../../../pages/api/client/HomeAPI";
import { GioHangAPI } from "../../../pages/api/client/gioHang/GioHangAPI";
import { get,set } from "local-storage";
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
      console.log("product",res.data);

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
    try {
      const cartId = storedData?.userID
        ? (await GioHangAPI.getByIDKH(storedData.userID))?.data?.id
        : storedGioHang?.id;
      if (!cartId) return updateTotalQuantity(0);
      const items = (await GioHangAPI.getAllGHCTByIDGH(cartId))?.data ?? [];
      updateTotalQuantity(items.reduce((sum, it) => sum + (Number(it.soLuong)||0), 0));
    } catch (e) {
      console.error("loadCountGioHang:", e);
      updateTotalQuantity(0);
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

  // ==== Utils gọn ====
  const taoMa = (n = 6, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") =>
  Array.from({ length: n }, () => c[(Math.random() * c.length) | 0]).join("");


// Ưu tiên khuyến mãi từ tham số km nếu có; fallback dùng dữ liệu của variant
const tinhTien = (v, q, km) => {
  const loai = km?.loaiKM ?? v?.loaiKM;
  const gt = km?.giaTriKhuyenMai ?? v?.giaTriKhuyenMai ?? 0;
  const gia = Number(v?.giaBan || 0);
  return !loai
    ? gia * q
    : loai === "Tiền mặt"
    ? (gia - gt) * q
    : (gia - (gia * gt) / 100) * q;
  };

  const getOrCreateCart = async (khachHang, stored) => {
  if (stored?.id) return stored;
  if (khachHang) {
    const r = await GioHangAPI.getByIDKH(khachHang);
  if (r?.data) return r.data;
    return (await GioHangAPI.addGH({ ma: taoMa(), khachHang })).data;
  }
  const t = await GioHangAPI.addGH({ ma: taoMa(), khachHang: null });
  set("GioHang", t?.data);
  return t?.data;
  };

  const upsertGhct = async (gioHangId, ctsp, soLuong, thanhTien) => {
  const r = await GioHangAPI.getAllGHCTByIDGH(gioHangId);
  const cur = (r?.data||[]).find(x => x.chiTietSanPham === ctsp.id);
  console.log("ctsp",ctsp);
  const body = {
    gioHang: {"id":cur ? cur.gioHang : gioHangId},
    chiTietSanPham: {"id":ctsp.id},
    soLuong,
    thanhTien,
    ...(cur && { id: cur.id })
  };
  return cur ? GioHangAPI.updateSLGHCT(body) : GioHangAPI.addGHCT(body);
  };

// ==== Hàm gọi trong ModalDetailSP ====
const handleAddGioHang = async () => {
  try {
    if (!selectedVariant)
      return toast.error("Vui lòng chọn màu & size hợp lệ!");

    if (Number(soLuong) > Number(selectedVariant?.soLuong || 0))
      return toast.error("Số lượng sản phẩm không đủ!");

    const gh = await getOrCreateCart(khachHang, storedGioHang);
    if (!gh?.id) throw new Error("Không xác định giỏ hàng.");

    const thanhTien = tinhTien(selectedVariant, soLuong, km);
    await upsertGhct(gh.id, selectedVariant, soLuong, thanhTien);

    toast.success("✔️ Thêm thành công!", { position: "top-right" });
    loadCountGioHang();
  } catch (e) {
    console.error(e);
    toast.error("Thêm giỏ hàng thất bại. Vui lòng thử lại!");
  }
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
          <div
            className="d-flex mt-2"
            style={{ gap: "8px", overflowX: "auto" }}
          >
            {productDetail.colors
              ?.find((c) => c.id === selectedMauSac)
              ?.images?.map((url, i) => (
                <img
                  key={i}
                  style={{
                    width: 85,
                    height: 85,
                    cursor: "pointer",
                    border: "2px solid #ccc",
                    borderRadius: "6px",
                    padding: "1px",
                    flexShrink: 0, // giữ nguyên kích thước, không co lại
                  }}
                  src={url}
                  alt={`thumb-${i}`}
                  onClick={() => handleImageClick(url)}
                />
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
