import Header from "@/app/_component/universal/Header";
import Search from "@/app/_component/universal/Search";
import BoardDetail from "@/app/_component/item/BoardDetail";

export default function ItemBoardDetail({params} : {params : {board_id : string}}) {
  
  return (
    <>
      <Header />
      <Search /> 
      <BoardDetail board_id={params.board_id}/>
    </>
  );
  
}