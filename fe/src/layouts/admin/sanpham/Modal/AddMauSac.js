import React from "react";
import { Modal, Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import convert from "color-convert"; // npm i color-convert
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function AddMauSacModal({
  open,
  onClose,
  form,
  componentSize,
  onFormLayoutChange,
  formItemLayout,
  msData = [],
  loadMS,
}) {
  // ----- Validate tên màu -----
  const validateTenMau = (_, value) => {
    const v = (value ?? "").trim();
    if (!v) return Promise.reject("Tên không được để trống");

    const specialCharacterRegex =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(v)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    }
    if (v.length > 50) {
      return Promise.reject("Tên không được vượt quá 50 ký tự");
    }
    return Promise.resolve();
  };

  // ----- Check trùng mã màu (không phân biệt hoa/thường) -----
  const checkTrungMa = (code) => {
    const c = (code || "").toUpperCase();
    return msData.some((x) => (x.ma || "").toUpperCase() === c);
  };

  // ----- Khi chọn màu: set ma, và auto-fill tên nếu user chưa chỉnh/đang trống -----
  const doiMau = (e) => {
    const ma = e.target.value; // dạng #RRGGBB
    const tenHienTai = form.getFieldValue("ten");
    const daChinhTen =
      typeof form.isFieldTouched === "function"
        ? form.isFieldTouched("ten")
        : false;

    // luôn set mã màu
    form.setFieldsValue({ ma });

    // chỉ auto-fill tên khi user chưa chỉnh hoặc hiện đang trống
    if (!daChinhTen || !tenHienTai) {
      try {
        const hexCode = (ma || "").replace("#", "").toUpperCase();
        const rgb = convert.hex.rgb(hexCode); // [r,g,b]
        const colorName = convert.rgb.keyword(rgb); // ví dụ 'red' | null
        form.setFieldsValue({ ten: colorName || "" });
      } catch {
        // nếu parse lỗi thì để trống
        form.setFieldsValue({ ten: "" });
      }
    }
  };

  // ----- Submit thêm màu sắc -----
  const addMauSac = async (values) => {
    const payload = { ...values };
    // Nếu tên đang trống -> auto gán theo mã
    if (!payload.ten || !payload.ten.trim()) {
      try {
        const hexCode = (payload.ma || "").replace("#", "").toUpperCase();
        const rgb = convert.hex.rgb(hexCode);
        const colorName = convert.rgb.keyword(rgb);
        payload.ten = colorName || "";
      } catch {
        payload.ten = "";
      }
    } else {
      payload.ten = payload.ten.trim();
    }

    // Kiểm trùng mã
    if (checkTrungMa(payload.ma)) {
      toast.error("Mã màu đã tồn tại!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    // Gọi API
    try {
      await ThuocTinhAPI.create("mau-sac", payload);
      loadMS?.();
      form.resetFields();
      onClose?.();
      toast.success("Thêm thành công!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Có lỗi xảy ra khi thêm màu!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
  };

  return (
    <Modal
      title="Thêm Màu Sắc"
      centered
      open={open}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            Modal.confirm({
              centered: true,
              title: "Thông báo",
              content: "Bạn có chắc chắn muốn thêm không?",
              onOk: () => form.submit(),
              footer: (_, { OkBtn, CancelBtn }) => (
                <>
                  <CancelBtn />
                  <OkBtn />
                </>
              ),
            });
          }}
        >
          Thêm
        </Button>,
      ]}
      width={500}
    >
      <Form
        {...formItemLayout}
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        layout="horizontal"
        form={form}
        onFinish={addMauSac}
      >
        <Form.Item
          name="ma"
          label="Màu sắc: "
          hasFeedback
          rules={[{ required: true, message: "Vui lòng chọn màu" }]}
        >
          <Input
            type="color"
            onChange={doiMau}
            style={{ width: 350 }}
            className="card-mau"
          />
        </Form.Item>
        <Form.Item name="ma" label="Mã màu" hasFeedback>
          <Input readOnly style={{ width: 350 }} className="border" />
        </Form.Item>

        {/* Tên màu: người dùng có thể sửa, validator như yêu cầu */}
        <Form.Item
          name="ten"
          label="Tên màu"
          hasFeedback
          rules={[{ validator: validateTenMau }]}
        >
          <Input style={{ width: 350 }} maxLength={51} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
