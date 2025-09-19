import { useNavigate } from "react-router-dom";
import "./NotAccess.css";
import { Button } from "antd";
import localStorage from "local-storage";
export default function NotAccess() {
  const nav = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    nav(`/login`);
  };
  return (
    <div>
      <section class="page_403">
        <div class="container">
          <div class="row">
            <div class="col-sm-12 ">
              <div class="col-sm-10 col-sm-offset-1  text-center">
                <div class="four_zero_three_bg">
                </div>

                <div class="contant_box_403">

                  <Button
                    class="link_403"
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#39ac31",
                      color: "white",
                      width: "220px",
                      height: "40px",
                    }}
                    onClick={() => handleClick()}
                  >
                    <span style={{ fontWeight: "bold" }}> Login With Admin Account</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
