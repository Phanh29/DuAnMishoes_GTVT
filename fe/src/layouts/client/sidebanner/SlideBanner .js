import React from "react";

export const SlideBanner = ({ img, subtitle, title, price, btnText }) => {
  return (
    <div style={{ position: "relative", width: "1296px", height: "450px" }}>
      <img
        src={img}
        alt="banner"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <div
        className="intro-content"
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          zIndex: 2,
        }}
      >
        <h3 className="intro-subtitle">{subtitle}</h3>
        <h1 className="intro-title">{title}</h1>
        <div className="intro-price">{price}</div>
        <a
          href="/san-pham"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "30px",
            background: "white",
            color: "black",
            textDecoration: "none",
            fontWeight: "bold",
            marginTop: "15px",
          }}
        >
          {btnText}
        </a>
      </div>
    </div>
  );
};
