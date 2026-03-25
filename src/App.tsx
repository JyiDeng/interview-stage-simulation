import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type SceneMode = "stage" | "online" | "onsite";

type StageSeat = {
  row: number;
  seat: number;
  occupied: boolean;
  personSeed: number;
};

type PersonCard = {
  id: string;
  role: string;
  active: boolean;
  emphasis?: "lead" | "normal";
};

const sceneLabels: Record<SceneMode, string> = {
  stage: "舞台模拟",
  online: "在线面试",
  onsite: "线下面试"
};

const palette = [
  ["#f5c7a9", "#d39371", "#5c3528"],
  ["#ffd9c2", "#c8805c", "#40231a"],
  ["#c98c69", "#9c5c3b", "#2f1e17"],
  ["#8f5738", "#6b3f27", "#241712"],
  ["#f1d4b8", "#ab6a44", "#3b281f"]
];

function buildStageSeats(occupancy: number): StageSeat[] {
  return Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10);
    const seat = index % 10;
    return {
      row,
      seat,
      occupied: Math.random() < occupancy,
      personSeed: Math.floor(Math.random() * 1000)
    };
  });
}

function buildInterviewers(count: number, leadIndex = 0): PersonCard[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `person-${index}`,
    role: index === leadIndex ? "主面试官" : index % 2 === 0 ? "观察员" : "面试官",
    active: Math.random() > 0.45,
    emphasis: index === leadIndex ? "lead" : "normal"
  }));
}

function AvatarFigure({
  seed,
  scale = 1,
  seated = true,
  bustOnly = false,
  active = false
}: {
  seed: number;
  scale?: number;
  seated?: boolean;
  bustOnly?: boolean;
  active?: boolean;
}) {
  const tones = palette[seed % palette.length];
  const animationDelay = `${(seed % 7) * 0.23}s`;

  return (
    <div
      className={[
        "avatar",
        seated ? "avatar-seated" : "avatar-standing",
        bustOnly ? "avatar-bust" : "",
        active ? "avatar-active" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--skin-light": tones[0],
          "--skin-mid": tones[1],
          "--hair": tones[2],
          "--scale": scale,
          "--delay": animationDelay
        } as CSSProperties
      }
    >
      <div className="avatar-head">
        <span className="avatar-hair" />
        <span className="avatar-face-shine" />
        <span className="avatar-eye left" />
        <span className="avatar-eye right" />
        <span className="avatar-mouth" />
      </div>
      <div className="avatar-neck" />
      <div className="avatar-body" />
      <div className="avatar-arms" />
    </div>
  );
}

function StageScene({ occupancy }: { occupancy: number }) {
  const seats = useMemo(() => buildStageSeats(occupancy), [occupancy]);

  return (
    <section className="scene-card">
      <div className="scene-heading">
        <div>
          <p className="eyebrow">Audience Simulation</p>
          <h2>阶梯式观众席</h2>
        </div>
        <span className="badge">100 座 / 10 排</span>
      </div>
      <div className="stage-shell">
        <div className="stage-lights" />
        <div className="stage-platform">
          <div className="stage-floor" />
          <div className="auditorium">
            {Array.from({ length: 10 }, (_, rowIndex) => {
              const rowSeats = seats.slice(rowIndex * 10, rowIndex * 10 + 10);
              return (
                <div
                  className="auditorium-row"
                  key={`row-${rowIndex}`}
                  style={{ "--row": rowIndex } as CSSProperties}
                >
                  {rowSeats.map((seat) => (
                    <div className="seat-slot" key={`${seat.row}-${seat.seat}`}>
                      {seat.occupied && (
                        <AvatarFigure seed={seat.personSeed} scale={0.55 + seat.row * 0.035} />
                      )}
                      <div className="seat-base" />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function OnlineScene({ count }: { count: number }) {
  const people = useMemo(() => buildInterviewers(count, 0), [count]);

  return (
    <section className="scene-card">
      <div className="scene-heading">
        <div>
          <p className="eyebrow">Meeting Simulation</p>
          <h2>在线视频面试窗口</h2>
        </div>
        <span className="badge">{count} 位面试官</span>
      </div>
      <div className="meeting-shell">
        <div className="meeting-topbar">
          <span className="window-dot red" />
          <span className="window-dot amber" />
          <span className="window-dot green" />
          <div className="meeting-title">Interview Room / Live</div>
        </div>
        <div className={`meeting-grid cols-${Math.min(count, 6)}`}>
          {people.map((person, index) => (
            <article className="meeting-tile" key={person.id}>
              <div className="meeting-gradient" />
              <AvatarFigure seed={index * 31 + 7} bustOnly active={person.active} scale={1.05} />
              <div className="meeting-meta">
                <strong>{person.role}</strong>
                <span>{person.active ? "发言中" : "静音观察"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OnsiteScene({ count, rows }: { count: number; rows: number }) {
  const people = useMemo(() => buildInterviewers(count, 1), [count]);
  const perRow = Math.ceil(count / rows);

  return (
    <section className="scene-card">
      <div className="scene-heading">
        <div>
          <p className="eyebrow">Panel Simulation</p>
          <h2>线下面试官席位</h2>
        </div>
        <span className="badge">
          {rows} 排 / {count} 人
        </span>
      </div>
      <div className="onsite-shell">
        <div className="desk-plane">
          {Array.from({ length: rows }, (_, rowIndex) => {
            const rowPeople = people.slice(rowIndex * perRow, rowIndex * perRow + perRow);
            return (
              <div className="panel-row" key={`panel-row-${rowIndex}`}>
                {rowPeople.map((person, index) => (
                  <div className="panel-seat" key={person.id}>
                    <AvatarFigure
                      seed={rowIndex * 17 + index * 9}
                      seated={false}
                      active={person.active}
                      scale={rowIndex === 0 ? 1 : 0.92}
                    />
                    <div className="panel-desk" />
                    <div className="panel-name">
                      <strong>{person.role}</strong>
                      <span>{person.emphasis === "lead" ? "核心提问" : "协同评估"}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [mode, setMode] = useState<SceneMode>("stage");
  const [occupancy, setOccupancy] = useState(0.4);
  const [onlineCount, setOnlineCount] = useState(4);
  const [onsiteCount, setOnsiteCount] = useState(4);
  const [onsiteRows, setOnsiteRows] = useState(1);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const activeScene = useMemo(() => {
    if (mode === "stage") {
      return <StageScene occupancy={occupancy} />;
    }
    if (mode === "online") {
      return <OnlineScene count={onlineCount} />;
    }
    return <OnsiteScene count={onsiteCount} rows={onsiteRows} />;
  }, [mode, occupancy, onlineCount, onsiteCount, onsiteRows]);

  async function toggleFullscreen() {
    if (!fullscreenRef.current) {
      return;
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await fullscreenRef.current.requestFullscreen();
  }

  return (
    <main className="app-shell">
      <aside className="control-panel">
        <div>
          <p className="eyebrow">Presence Simulator</p>
          <h1>舞台 / 在线 / 线下面试模拟器</h1>
          <p className="panel-copy">
            先提供可预览的场景与人物占位层。后续可替换为更高逼真的动态数字人头像或半身渲染。
          </p>
        </div>

        <div className="segment-group">
          {(["stage", "online", "onsite"] as SceneMode[]).map((item) => (
            <button
              key={item}
              className={mode === item ? "segment active" : "segment"}
              onClick={() => setMode(item)}
              type="button"
            >
              {sceneLabels[item]}
            </button>
          ))}
        </div>

        {mode === "stage" && (
          <label className="control-block">
            <span>观众出现密度</span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={occupancy}
              onChange={(event) => setOccupancy(Number(event.target.value))}
            />
            <strong>{Math.round(occupancy * 100)}%</strong>
          </label>
        )}

        {mode === "online" && (
          <label className="control-block">
            <span>面试官人数</span>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={onlineCount}
              onChange={(event) => setOnlineCount(Number(event.target.value))}
            />
            <strong>{onlineCount} 人</strong>
          </label>
        )}

        {mode === "onsite" && (
          <>
            <label className="control-block">
              <span>线下面试官人数</span>
              <input
                type="range"
                min="3"
                max="6"
                step="1"
                value={onsiteCount}
                onChange={(event) => setOnsiteCount(Number(event.target.value))}
              />
              <strong>{onsiteCount} 人</strong>
            </label>
            <label className="control-block">
              <span>排数</span>
              <input
                type="range"
                min="1"
                max="2"
                step="1"
                value={onsiteRows}
                onChange={(event) => setOnsiteRows(Number(event.target.value))}
              />
              <strong>{onsiteRows} 排</strong>
            </label>
          </>
        )}

        <div className="notes">
          <p>适合先做网页预演、构图验证、座位占位和场景节奏测试。</p>
          <p>人物层已按座位和视角缩放，支持单场景全屏。</p>
        </div>
      </aside>

      <section className="preview-shell">
        <div className="preview-toolbar">
          <div>
            <p className="eyebrow">Live Preview</p>
            <h2>{sceneLabels[mode]}</h2>
          </div>
          <button className="fullscreen-button" onClick={toggleFullscreen} type="button">
            {isFullscreen ? "退出全屏" : "全屏放大"}
          </button>
        </div>
        <div className="preview-stage" ref={fullscreenRef}>
          {activeScene}
        </div>
      </section>
    </main>
  );
}
