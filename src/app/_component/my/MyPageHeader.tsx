"use client";

export default function MyPageHeader() {
  return (
    <>
      <div className="col-span-3">
        <div className="flex flex-col">
          <div className="border-t-4 border-purple-500"></div>
          <div className="border">
            <div className="p-3 border-b">나의 판매물품</div>
            <div className="py-3 px-5 bg-gray-100 text-sm">
              <ul>
                <li className="pb-1">판매 등록한 물품</li>
                <li className="pb-1">판매진행 중 물품</li>
                <li className="pb-1">판매완료 된 물품</li>
              </ul>
            </div>
            <div className="p-3 border-b">나의 구매물품</div>
            <div className="py-3 px-5 bg-gray-100 text-sm">
              <ul>
                <li className="pb-1">구매 등록한 물품</li>
                <li className="pb-1">구매진행 중 물품</li>
                <li className="pb-1">구매완료 된 물품</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
