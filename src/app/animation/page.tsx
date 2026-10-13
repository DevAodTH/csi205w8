"use client";

import { useEffect, useRef, useState } from "react";

import fieldImage from "@/assets/field.svg";
import basketballImage from "@/assets/basketball.svg";
import footballImage from "@/assets/football.svg";
import valleyballImage from "@/assets/valleyball.svg";
import humanImage from "@/assets/human.svg";
import cartoonImage from "@/assets/cartoon.svg";
import { Button } from "@/components/tailgrids/core/button";

// วางนอก component เพื่อไม่ให้สร้าง object ใหม่ทุกครั้งที่ re-render
const BALL_IMAGES = {
  none: "",
  basketball: basketballImage,
  football: footballImage,
  valleyball: valleyballImage,
  human: humanImage,
  cartoon: cartoonImage,
};

const BALL_TYPES = [
  { id: "none", label: "None", tone: "black" },
  { id: "basketball", label: "Basketball", tone: "blue" },
  { id: "football", label: "Football", tone: "blue" },
  { id: "valleyball", label: "Volleyball", tone: "blue" },
  { id: "human", label: "Human", tone: "blue" },
  { id: "cartoon", label: "Cartoon", tone: "blue" },
];

export default function animation({
  fieldWidth,
  fieldHeight,
  ballRadius,
  speed,
}: {
  fieldWidth: number;
  fieldHeight: number;
  ballRadius: number;
  speed: number;
}) {
  // ค่า default ถ้าไม่ส่ง props มา
  const _fieldWidth = fieldWidth || 640;
  const _fieldHeight = fieldHeight || 480;
  const _ballRadius = ballRadius || 50;
  const _speed = speed || 260; // px ต่อวินาที

  // คำนวณภายใน
  const _ballDiameter = 2 * _ballRadius;

  const ballRef = useRef<HTMLDivElement>(null)
  const [ballType, setBallType] = useState("none");
  const [running, setRunning] = useState(false);

  // เก็บใน ref เพราะลูปแก้ค่าพวกนี้ 60 ครั้งต่อวินาที ไม่ต้อง re-render
  const posRef = useRef({ x: 100, y: 100 });
  const dirRef = useRef({ x: 1, y: 1 });
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  // เปลี่ยนสกินลูกบอลตาม ballType
  // ต้องใส่ quote ใน url() แปลง SVG เล็กเป็น data URI ที่มี ' อยู่ข้างใน
  useEffect(() => {
  const image = BALL_IMAGES[ballType as keyof typeof BALL_IMAGES]
  if (ballRef.current) {
    // ดึงค่า .src ออกมาจาก Object รูปภาพที่ Next.js เจนให้
    const imageUrl = image && typeof image === 'object' ? (image as any).src : image
    ballRef.current.style.backgroundImage = imageUrl ? `url("${imageUrl}")` : ''
  }
}, [ballType])
  // ลูป animation: rAF ผูกกับจังหวะวาดจอ ส่วน delta time ทำให้ความเร็วเท่ากันทุกจอ
  useEffect(() => {
    if (!running) return undefined;

    const maxX = _fieldWidth - _ballDiameter;
    const maxY = _fieldHeight - _ballDiameter;
    // กลิ้งครบ 1 เส้นรอบวง = หมุน 1 รอบ
    const degreesPerPixel = 360 / (Math.PI * _ballDiameter);

    const tick = (ts:number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const pos = posRef.current;
      const dir = dirRef.current;

      pos.x += dir.x * _speed * dt;
      pos.y += dir.y * _speed * dt;

      // เด้งทั้ง 4 ด้าน และ clamp ไม่ให้ลูกบอลหลุดออกนอกสนาม
      if (pos.x <= 0) {
        pos.x = 0;
        dir.x = 1;
      } else if (pos.x >= maxX) {
        pos.x = maxX;
        dir.x = -1;
      }
      if (pos.y <= 0) {
        pos.y = 0;
        dir.y = 1;
      } else if (pos.y >= maxY) {
        pos.y = maxY;
        dir.y = -1;
      }

      angleRef.current += dir.x * _speed * dt * degreesPerPixel;

      const ball = ballRef.current;
      if (ball) {
        ball.style.left = `${pos.x}px`;
        ball.style.top = `${pos.y}px`;
        ball.style.transform = `rotate(${angleRef.current}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [running, _fieldWidth, _fieldHeight, _ballDiameter, _speed]);
  
  return (
    <div className="mt-4 mb-4 w-[800px] mx-auto flex flex-col items-center justify-center">
      {/* กล่องครอบ animation */}
      <div className='mt-3 flex flex-col items-center justify-center' style={{ width: 'fit-content' }}>
        {/* สนาม */}
        <div
          className="border-2 border-black rounded-xl relative overflow-hidden"
          style={{
            width: `${_fieldWidth}px`,
            height: `${_fieldHeight}px`,
            backgroundImage: `url(${fieldImage?.src || fieldImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          {/* ลูกบอล */}
          <div
            ref={ballRef}
            className="border border-black rounded-full absolute"
            style={{
              width: `${_ballDiameter}px`,
              height: `${_ballDiameter}px`,
              backgroundColor: "lightblue",
              backgroundImage: "",
              backgroundSize: "cover",
              backgroundPosition: "center",
              top: "100px",
              left: "100px",
            }}
          ></div>
        </div>

        {/* แถวปุ่ม */}
        <div className='flex justify-between gap-1 mt-5'>
          <Button
            className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition ${running ? 'bg-red-500 text-white hover:bg-red-800' : 'bg-green-500 text-white hover:bg-green-800'}`}
            onClick={() => setRunning(!running)}
          >
            {running ? 'PAUSE' : 'RUN'}
          </Button>

          {/* เลือกสกินลูกบอล */}
          <div className='flex justify-end gap-1'>
            {BALL_TYPES.map((type) => {
              const isSelected = ballType === type.id;
              
              return (
                <Button
                  key={type.id}
                  className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition min-w-[100px] ${
                    isSelected 
                      ? type.tone === 'black'
                        ? 'bg-black text-white hover:bg-opacity-90'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      : type.tone === 'black'
                        ? 'border border-black bg-white text-gray-700 hover:bg-black hover:text-white hover:border-black'
                        : 'border border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                  onClick={() => setBallType(type.id)}
                >
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}