import React from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import convert from "color-convert";
import { toast } from "react-toastify";
import { ThuocTinhAPI } from "../../../../pages/api/sanpham/ThuocTinhAPI";

export default function UpdateMauSac({
    openUpdate,
    setOpenUpdate,
    form1,
    msUpdate,
    setmsUpdates,
    tenCheck,
    formItemLayout,
    maCheck,
    mauSac,
    loadMauSac,
}) {

    const validateDateMauSacUpdate = () => {
        const ten = (form1.getFieldValue("ten") || "").trim();
        if (!ten) return Promise.reject("Tên không được để trống");
        if (/[!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/.test(ten))
            return Promise.reject("Tên không được chứa ký tự đặc biệt");
        if (ten.length > 50)
            return Promise.reject("Tên không được vượt quá 50 ký tự");
        return Promise.resolve();
    };


    const doiMauUpdate = (e) => {
        const hex = (e?.target?.value || "").replace("#", "").toUpperCase();
        if (!hex) return;
        const rgb = convert.hex.rgb(hex);
        const colorName = convert.rgb.keyword(rgb);
        setmsUpdates((prev) => ({
            ...prev,
            ma: `#${hex}`,
            ten: colorName ?? prev.ten,
        }));
        form1.setFieldsValue({
            ma: `#${hex}`,
            ten: colorName ?? form1.getFieldValue("ten"),
        });
    };


    const updateMauSac = () => {
        // check trùng tên
        if (msUpdate.ten !== tenCheck) {
            const trTen = mauSac.some(
                (x) =>
                    (x.ten || "").toLowerCase().trim() ===
                    (msUpdate.ten || "").toLowerCase().trim()
            );
            if (trTen) {
                toast.error("Tên màu trùng với màu sắc khác!", {
                    autoClose: 2500,
                    theme: "light",
                });
                return;
            }
        }
        // check trùng mã
        if (msUpdate.ma !== maCheck) {
            const trMa = mauSac.some(
                (x) => (x.ma || "").trim().toUpperCase() === (msUpdate.ma || "").trim().toUpperCase()
            );
            if (trMa) {
                toast.error("Mã màu trùng với màu sắc khác!", {
                    autoClose: 2500,
                    theme: "light",
                });
                return;
            }
        }

        ThuocTinhAPI.update("mau-sac", msUpdate.id, msUpdate).then(() => {
            toast.success("Sửa thành công!");
            setmsUpdates({});
            loadMauSac();
            setOpenUpdate(false);
        }).catch((err) => {
            console.error(err);
            toast.error("Có lỗi khi cập nhật!", { autoClose: 2500, theme: "light" });
        });
    };
    return (
        <Modal
            title="Sửa Màu Sắc"
            centered
            open={openUpdate}
            onCancel={() => setOpenUpdate(false)}
            footer={null}
            width={500}
        >
            <Form
                {...formItemLayout}
                form={form1}
                layout="horizontal"
                size="middle"
                onFinish={updateMauSac}
            >
                <Form.Item
                    label="Màu sắc: "
                    name="ma"
                    hasFeedback
                    rules={[{ required: true, message: "Vui lòng chọn màu" }]}
                >
                    <Input
                        className="card-mau"
                        type="color"
                        style={{ width: 350 }}
                        onChange={doiMauUpdate}
                    />
                </Form.Item>
                <Form.Item
                    label="Mã màu: "
                >
                    <Input
                        readOnly
                        style={{ width: 350 }}
                        className="border mb-3"
                        value={msUpdate?.ma || ""}
                    />
                </Form.Item>
                <Form.Item
                    label="Tên màu: "
                    name="ten"
                    hasFeedback
                    rules={[{ validator: validateDateMauSacUpdate }]}
                >
                    <Input
                        maxLength={51}
                        style={{ width: 350 }}
                        value={msUpdate?.ten}
                        onChange={(e) =>
                            setmsUpdates({ ...msUpdate, ten: e.target.value })
                        }
                    />
                </Form.Item>

                <Form.Item
                label="Trạng thái: "
                >
                    <Radio.Group
                        value={msUpdate?.trangThai}
                        onChange={(e) =>
                            setmsUpdates({
                                ...msUpdate,
                                trangThai: e.target.value,
                            })
                        }
                    >
                        <Radio value={0}>Còn bán</Radio>
                        <Radio value={1}>Dừng bán</Radio>
                    </Radio.Group>
                </Form.Item>

                <div className="text-end">
                    <Button onClick={() => setOpenUpdate(false)} className="me-2">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Sửa
                    </Button>
                </div>
            </Form>
        </Modal >
    );
}
