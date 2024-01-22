
import EditComponent from "@/app/_component/item/BoardEdit";
import Header from "@/app/_component/universal/Header";


export default function Edit({params} : {params : {board_id : string}}) {
  return (
    <>
        <Header />
        <EditComponent board_id={params.board_id} />
    </>
  );
  
}