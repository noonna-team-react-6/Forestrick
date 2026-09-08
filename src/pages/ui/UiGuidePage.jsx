import { useState } from "react";
import Button from "../../components/common/Button";
import ModalFrame from "../../components/common/ModalFrame";
import * as Icons from "../../components/common/Icons";
import "./UiGuidePage.css";

const labelStyle = { color: "#9CA3AF", margin: "16px 0 8px", fontSize: 13 };
const rowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};

const iconEntries = Object.entries(Icons).filter(([name]) =>
  name.startsWith("Icon"),
);

export default function UiGuidePage() {
  const [modal, setModal] = useState(null);
  const [chip, setChip] = useState("email");
  const close = () => setModal(null);

  return (
    <div
      style={{
        background: "#0A0E14",
        minHeight: "100vh",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <h2 style={{ color: "#fff" }}>UI Guide</h2>

      <p style={labelStyle}>Button / variant</p>
      <div style={rowStyle}>
        <Button>primary</Button>
        <Button variant="outline">outline</Button>
        <Button variant="gradient">
          <Icons.IconSparkles />
          AI로 작성하기
        </Button>
      </div>

      <p style={labelStyle}>Button / size</p>
      <div style={rowStyle}>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
        <Button variant="outline" size="sm">
          outline sm
        </Button>
        <Button variant="outline" size="md">
          outline md
        </Button>
        <Button variant="outline" size="lg">
          outline lg
        </Button>
        <Button variant="gradient" size="sm">
          <Icons.IconSparkles />
          gradient sm
        </Button>
        <Button variant="gradient" size="lg">
          <Icons.IconSparkles />
          gradient lg
        </Button>
      </div>

      <p style={labelStyle}>Button / selected (칩 클릭)</p>
      <div style={rowStyle}>
        <Button
          variant="outline"
          selected={chip === "email"}
          onClick={() => setChip("email")}
        >
          이메일
        </Button>
        <Button
          variant="outline"
          selected={chip === "schedule"}
          onClick={() => setChip("schedule")}
        >
          일정변경
        </Button>
        <Button
          variant="outline"
          selected={chip === "reserve"}
          onClick={() => setChip("reserve")}
        >
          예약
        </Button>
      </div>
      <div style={rowStyle}>
        <Button selected>primary selected</Button>
        <Button variant="gradient" selected>
          <Icons.IconSparkles />
          gradient selected
        </Button>
      </div>

      <p style={labelStyle}>Button / icon + children</p>
      <div style={rowStyle}>
        <Button variant="outline">
          <Icons.IconPencil />
          수정
        </Button>
        <Button variant="outline">
          <Icons.IconCopy />
          복사
        </Button>
      </div>

      <p style={labelStyle}>Button / disabled</p>
      <div style={rowStyle}>
        <Button disabled>primary</Button>
        <Button variant="outline" disabled>
          outline
        </Button>
        <Button variant="gradient" disabled>
          <Icons.IconSparkles />
          gradient
        </Button>
      </div>

      <p style={labelStyle}>Icons</p>
      <div className="icon-grid">
        {iconEntries.map(([name, Icon]) => (
          <div key={name} className="icon-item">
            <Icon size={22} />
            <span>{name.replace("Icon", "")}</span>
          </div>
        ))}
      </div>

      <p style={labelStyle}>ModalFrame</p>
      <div style={rowStyle}>
        <Button onClick={() => setModal("loading")}>
          로딩 (바깥 클릭 안 닫힘)
        </Button>
        <Button variant="outline" onClick={() => setModal("default")}>
          기본 (바깥 클릭 닫힘, X 없음)
        </Button>
        <Button variant="outline" onClick={() => setModal("closeIcon")}>
          기본 + X 아이콘
        </Button>
        <Button variant="outline" onClick={() => setModal("small")}>
          small
        </Button>
        <Button variant="outline" onClick={() => setModal("medium")}>
          medium
        </Button>
        <Button variant="outline" onClick={() => setModal("large")}>
          large
        </Button>
        <Button variant="outline" onClick={() => setModal("className")}>
          className
        </Button>
      </div>

      <ModalFrame type="loading" width="medium" open={modal === "loading"}>
        <p>AI가 문서를 작성하고 있습니다.</p>
        <p style={{ color: "#9CA3AF" }}>바깥을 클릭해도 닫히지 않습니다.</p>
        <Button onClick={close}>로딩 완료 (닫기)</Button>
      </ModalFrame>

      <ModalFrame
        type="default"
        width="medium"
        open={modal === "default"}
        onClose={close}
      >
        <p>기본 모달입니다. 바깥을 클릭하면 닫힙니다.</p>
      </ModalFrame>

      <ModalFrame
        type="default"
        closeIcon
        width="large"
        open={modal === "closeIcon"}
        onClose={close}
      >
        <p>오른쪽 위 X 또는 바깥 클릭으로 닫힙니다.</p>
      </ModalFrame>

      <ModalFrame
        type="default"
        closeIcon
        width="small"
        open={modal === "small"}
        onClose={close}
      >
        <p>small 너비</p>
      </ModalFrame>

      <ModalFrame
        type="default"
        closeIcon
        width="medium"
        open={modal === "medium"}
        onClose={close}
      >
        <p>medium 너비</p>
      </ModalFrame>

      <ModalFrame
        type="default"
        closeIcon
        width="large"
        open={modal === "large"}
        onClose={close}
      >
        <p>large 너비</p>
      </ModalFrame>

      <ModalFrame
        type="default"
        closeIcon
        width="medium"
        className="modal-test-frame"
        open={modal === "className"}
        onClose={close}
      >
        <p>초록 점선이면 className이 적용된 겁니다.</p>
      </ModalFrame>
    </div>
  );
}
