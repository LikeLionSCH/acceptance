"use client"

import Image from "next/image"
import { Stack } from "@mui/material"
import styles from "./index.module.css"
import { useEffect, useRef, useState } from "react"
import userData from "./data"

let startPositionX = 0
let startPositionY = 0

let currentRotateX = 0
let currentRotateY = 0

export default function Postcard() {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [backWidth, setBackWidth] = useState(0)
  const [backHeight, setBackHeight] = useState(0)
  const [isNotMove, setIsNotMove] = useState(true)

  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    function touchStart(e: TouchEvent) {
      startPositionX = e.touches[0].clientX + currentRotateY * 2
      startPositionY = e.touches[0].clientY + currentRotateX * 2

      setIsMoving(true)
      setIsNotMove(false)
    }
    addEventListener("touchstart", touchStart)

    function touchMove(e: TouchEvent) {
      const diffX = e.touches[0].clientX - startPositionX
      const diffY = e.touches[0].clientY - startPositionY

      currentRotateX = diffY * -0.5
      currentRotateY = diffX * 0.5

      const isReverse = Math.floor((currentRotateX + 90) / 180) % 2 !== 0
      //뒤집혀 있으면 죄우로 긁었을때, 반대로 움직여야 함
      if (isReverse) {
        currentRotateY = currentRotateY * -1
      }

      setRotateX(currentRotateX)
      setRotateY(currentRotateY)
    }
    addEventListener("touchmove", touchMove)

    function touchEnd() {
      setIsMoving(false)
      const tempRotateX = Math.round(currentRotateX / 180.0)
      currentRotateX = tempRotateX * 180
      setRotateX(currentRotateX)

      const tempRotateY = Math.round(currentRotateY / 180.0)
      currentRotateY = tempRotateY * 180
      setRotateY(currentRotateY)
    }

    addEventListener("touchend", touchEnd)

    return () => {
      removeEventListener("touchstart", touchStart)
      removeEventListener("touchmove", touchMove)
      removeEventListener("touchend", touchEnd)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      if (imageRef.current) {
        // 이미지가 로드되면 뒷면의 크기를 설정
        while (imageRef.current.clientHeight === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
        setBackWidth(imageRef.current.clientWidth)
        setBackHeight(imageRef.current.clientHeight)
      }
    })()
  }, [imageRef.current])

  let foundData = userData.find((user) =>
    global.location?.search?.endsWith(user.url)
  )

  if (!foundData) {
    foundData = userData[0]
  }
  const course = foundData.course
  const userName = foundData.name
  const major = foundData.major

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      position="fixed"
      p="50px"
      bgcolor="grey.200"
      width="100svw"
      height="100svh"
      style={{
        perspective: "2000px",
      }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        className={`${styles.postcard} ${
          isNotMove ? styles["moving-animation"] : ""
        }`}
        position="relative"
        style={{
          transitionDuration: isMoving ? "0s" : "0.5s",
          zIndex: 1,
          backfaceVisibility: "hidden",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <Image
          ref={imageRef}
          className={styles["postcard-image"]}
          alt=""
          src="./front.png"
          width="0"
          height="0"
        />
        <Stack
          position="absolute"
          style={{
            width: backHeight,
            height: backWidth,
            rotate: "90deg",
          }}
        />
      </Stack>
      <Stack
        mx={backHeight / 100}
        my={backHeight / 150}
        position="absolute"
        fontFamily="handFont"
        fontSize={backHeight / 15}
        className={`${styles.postcard} 
          ${styles["postcard-back"]}`}
        display={isNotMove ? "none" : "block"}
        style={{
          width: backWidth,
          height: backHeight,
          transitionDuration: isMoving ? "0s" : "0.5s",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY + 180}deg)`,
        }}
      >
        <Stack p="24px" gap="12px" fontSize="12px" fontFamily="Pretendard">
          <Stack fontSize="24px" textAlign="center" mt="10px">
            합격증
          </Stack>
          <Stack marginTop="24px" gap="8px" fontSize="12px" ml="24px">
            <Stack>이름 : {userName}</Stack>
            <Stack>트랙 : {course}</Stack>
            <Stack>학과 : {major}</Stack>
          </Stack>
          <Stack marginTop="24px">
            안녕하세요, 멋쟁이사자처럼 순천향대학교 13기 운영진 입니다.
          </Stack>
          <Stack>
            멋쟁이사자처럼 13기 아기사자 모집에 지원해주셔서 감사합니다.
          </Stack>
          <Stack>
            {userName}님께서는 멋쟁이사자처럼 순천향대학교 13기 아기사자에
            최종합격하셨습니다.
          </Stack>
          <Stack>
            아기사자로서의 활동을 통해 많은 것을 배우고, 성장하는 기회가 되길
            바랍니다.
          </Stack>
          <Stack marginTop="44px" fontSize="10px" textAlign="right">
            2025년 3월 7일 <br /> 멋쟁이사자처럼 순천향대{" "}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
