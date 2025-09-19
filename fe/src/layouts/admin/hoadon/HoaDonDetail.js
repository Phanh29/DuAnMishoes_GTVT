import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import { Modal, Form } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { HoaDonAPI } from "../../../pages/api/hoadon/HoaDonAPI";
import { get as lsGet } from "local-storage";

// Icons
import { FaCheckCircle } from "react-icons/fa";
import { FaMoneyBillTrendUp, FaTruckFast } from "react-icons/fa6";
import { RiTruckFill } from "react-icons/ri";
import { SlNotebook } from "react-icons/sl";
import { GiNotebook, GiPiggyBank, GiReturnArrow } from "react-icons/gi";
import { ImCancelCircle } from "react-icons/im";

const STATUS_META = {
  "-2": { label: "Hoàn tiền", color: "pink", icon: FaMoneyBillTrendUp },
  "-1": { label: "Hủy", color: "#cd201f", icon: ImCancelCircle },
  0: {
    label: "Chờ xác nhận",
    color: "purple",
    icon: GiNotebook,
    next: "Đã xác nhận",
  },
  1: {
    label: "Xác nhận",
    color: "red",
    icon: SlNotebook,
    next: "Chờ vận chuyển",
  },
  2: {
    label: "Chờ vận chuyển",
    color: "blue",
    icon: RiTruckFill,
    next: "Đang vận chuyển",
  },
  3: {
    label: "Đang vận chuyển",
    color: "cyan",
    icon: FaTruckFast,
    next: "Đã thanh toán",
  },
  4: {
    label: "Đã thanh toán",
    color: "orange",
    icon: GiPiggyBank,
    next: "Thành công",
  },
  5: { label: "Thành công", color: "success", icon: FaCheckCircle },
  10: { label: "Trả hàng", color: "orange", icon: GiReturnArrow },
};

const titleByStatus = (st) =>
  STATUS_META[String(st)]?.label || "Không xác định";
const iconByStatus = (st) => STATUS_META[String(st)]?.icon || GiNotebook;
// giữ API cũ trong JSX
const showIcon = (st) => iconByStatus(Number(st));
const showTitle = (st) => titleByStatus(Number(st));

export default function HoaDonDetail() {
  const { id: idParam } = useParams();
  const { state } = useLocation();

  // 1) Ưu tiên lấy từ state
  const hoaDonFromState = state?.hoaDon || null;

  // 2) Nếu F5: lấy từ sessionStorage
  const hoaDonFromCache = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("hoaDonDetail");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // 3) Dùng cái có sẵn nhất
  const hoaDon = hoaDonFromState || hoaDonFromCache || null;

  // id để gọi timeline
  const invoiceId = useMemo(
    () => idParam ?? hoaDon?.idHD ?? hoaDon?.id ?? null,
    [idParam, hoaDon]
  );

  // form/modal (nếu bạn dùng)
  const [form] = Form.useForm();
  const [formRollBack] = Form.useForm();
  const [formHuy] = Form.useForm();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openRollback, setOpenRollback] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  // hiển thị
  const [detail, setDetail] = useState(hoaDon || {});
  const [status, setStatus] = useState(Number(hoaDon?.trangThai ?? 0));
  const [code, setCode] = useState(hoaDon?.ma ?? "");
  const [ListTimeLine, setListTimeLine] = useState([]);

  // user
  const [empCode, setEmpCode] = useState("");
  const [empName, setEmpName] = useState("");

  // chỉ tải timeline
  const loadTimeline = useCallback(async () => {
    if (!invoiceId) return;
    try {
      const res = await HoaDonAPI.getAllLichSuHoaDon(invoiceId);
      const list = res?.data || [];
      setListTimeLine(list);
      // nếu chưa có status (do F5 mất state), lấy theo mốc cuối của timeline
      if (!hoaDon && list.length > 0) {
        const last = list[list.length - 1];
        setStatus(Number(last?.trangThai ?? 0));
      }
    } catch {
      toast.error("Không thể tải lịch sử hoá đơn");
    }
  }, [invoiceId, hoaDon]);

  // Fallback cuối: không có hoaDon & cache thì lấy từ getAll() rồi find theo id
  const fallbackLoadBasic = useCallback(async () => {
    if (hoaDon || !invoiceId) return;
    try {
      const all = await HoaDonAPI.getAll().then((r) => r?.data || []);
      const found = all.find(
        (x) => String(x.idHD ?? x.id) === String(invoiceId)
      );
      if (found) {
        setDetail(found);
        setStatus(Number(found.trangThai ?? 0));
        setCode(found.ma || "");
        // lưu lại cache để lần sau F5 vẫn còn
        sessionStorage.setItem("hoaDonDetail", JSON.stringify(found));
      }
    } catch {
      // bỏ qua, vì đã có timeline hỗ trợ tối thiểu
    }
  }, [hoaDon, invoiceId]);

  useEffect(() => {
    const user = lsGet("userData");
    if (user) {
      setEmpCode(user.ma || "");
      setEmpName(user.ten || "");
    }
    // set từ state/cache (nếu có)
    if (hoaDon) {
      setDetail(hoaDon);
      setStatus(Number(hoaDon.trangThai ?? 0));
      setCode(hoaDon.ma || "");
    }
    loadTimeline(); // luôn lấy timeline
    fallbackLoadBasic(); // chỉ gọi khi thiếu state & cache
  }, [hoaDon, loadTimeline, fallbackLoadBasic]);

  return (
    <div className="w-100 mt-4">
      {/* Ví dụ header */}
      {/* <h4>Mã HĐ: {code}</h4>
          <Tag color={STATUS_META[String(status)]?.color}>{titleByStatus(status)}</Tag> */}

      <div className="bg-light rounded border border-danger p-3">
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              minWidth: Math.max((ListTimeLine?.length || 0) * 220, 720),
            }}
          >
            <Timeline
              minEvents={10}
              style={{ borderBottom: "1px solid rgb(224,224,224)" }}
              placeholder
            >
              {(ListTimeLine || []).map((item, idx) => (
                <TimelineEvent
                  key={`${item.trangThai}-${item.ngayTao}-${idx}`}
                  minEvents={6}
                  color={
                    Number(item.trangThai) < 0 || Number(item.trangThai) === 10
                      ? "#520808"
                      : "#3d874d"
                  }
                  icon={showIcon(item.trangThai)}
                  title={showTitle(item.trangThai)}
                  subtitle={moment(item.ngayTao).format("HH:mm:ss DD/MM/YYYY")}
                  isOpenEnding
                />
              ))}
            </Timeline>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
