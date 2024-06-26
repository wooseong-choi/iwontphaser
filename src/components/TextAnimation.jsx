import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import "./TypingAnimation.css";

gsap.registerPlugin(TextPlugin);

const TypingAnimation = () => {
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [index, setIndex] = useState(0);
  const textToType = [
    "will overcome challenges and obstacles with your teammates.",
    "will learn how to guide yourself to an exponential yet sustainable growth.",
    "will experience the true essence of programming in a flow state.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % textToType.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 기존 텍스트를 초기화
    gsap.to(textRef.current, { duration: 0, text: " " });

    // 새로운 텍스트 애니메이션
    gsap.to(textRef.current, {
      duration: 3,
      text: {
        value: textToType[index],
        delimiter: "",
      },
      ease: "none",
      onUpdate: () => {
        // 텍스트 길이에 따라 커서 위치 조정
        const textLength = textRef.current.textContent.length;
        cursorRef.current.style.left = `${textLength}ch`;
      },
    });
  }, [index]);

  return (
    <div className="typing-container">
      <span ref={textRef} className="typing-text"></span>
      <span ref={cursorRef} className="cursor"></span>
    </div>
  );
};

export default TypingAnimation;
