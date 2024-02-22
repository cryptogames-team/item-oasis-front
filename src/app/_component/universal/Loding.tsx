import Image from "next/image";


interface LoadingProp {
    width : number;
    height : number;
}

export default function Loading({width, height} : LoadingProp) {
  return (
    <>
      <Image
        src="/loading.gif"
        width={width}
        height={height}
        alt="로고"
        ></Image>
    </>
  );
  
}