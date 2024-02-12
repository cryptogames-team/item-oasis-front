import Search from "@/app/_component/universal/Search";
import BoardDetail from "@/app/_component/item/BoardDetail";

export default function ItemBoardDetail({params} : {params : {board_id : string}}) {
  
  return (
    <>
      <Search /> 
      <BoardDetail board_id={params.board_id}/>
    </>
  );
  
}