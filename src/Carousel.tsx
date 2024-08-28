import ImageContainer from "./ImageContainer";
import styles from "./Carousel.module.scss";
import { useEffect, useRef, useState } from "react";

interface ImgListType {
  id: number;
  alt: string;
  src: string;
}

interface PropsType {
  imgList: ImgListType[];
  autoSlideSec: number;
  isAutoCarousel: boolean;
}

export default function Carousel({
  imgList,
  autoSlideSec,
  isAutoCarousel,
}: PropsType) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [carouselList, setCarouselList] = useState<ImgListType[]>([]);
  const $ul = useRef<null | HTMLUListElement>(null);

  const interval = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (isAutoCarousel) {
      interval.current = setInterval(() => {
        handleSlider(1);
      }, autoSlideSec * 1000);
    }
    return () => {
      if (isAutoCarousel) {
        clearInterval(interval.current!);
      }
    };
  }, []);

  useEffect(() => {
    if (imgList.length !== 0) {
      const startImg = imgList[0];
      const endImg = imgList[imgList.length - 1];
      const newImgList = [endImg, ...imgList, startImg];

      setCarouselList(newImgList);
    }
  }, [imgList]);

  useEffect(() => {
    if (!$ul.current) return;
    $ul.current.style.transform = `translateX(-${100 * currentIndex}%)`;
  }, [currentIndex]);

  const moveToSlide = (index: number) => {
    setTimeout(() => {
      setCurrentIndex(index);
      if (!$ul.current) return;
      $ul.current.style.transition = "";
    }, 500);
  };
  const handleSlider = (index: number) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + index;

      if (newIndex === imgList.length + 1) {
        moveToSlide(1);
      } else if (newIndex === 0) {
        moveToSlide(imgList.length);
      }

      if ($ul.current) {
        $ul.current.style.transition = "all 0.5s ease-in-out";
      }
      return newIndex;
    });
  };

  return (
    <div className={styles.container}>
      {!isAutoCarousel && (
        <button
          className={styles.btn}
          onClick={() => {
            handleSlider(-1);
          }}
        >
          이전
        </button>
      )}
      <ul className={styles.carouselWrapper} ref={$ul}>
        {carouselList.map((item, index) => {
          return (
            <li key={index}>
              <ImageContainer src={item.src} width={600} />
            </li>
          );
        })}
      </ul>
      {!isAutoCarousel && (
        <button
          className={`${styles.btn} ${styles.next}`}
          onClick={() => {
            handleSlider(1);
          }}
        >
          다음
        </button>
      )}
    </div>
  );
}
