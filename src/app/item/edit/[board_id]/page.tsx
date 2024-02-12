import EditComponent from "@/app/_component/item/BoardEdit";


export default function Edit({params} : {params : {board_id : string}}) {
  return (
    <>
        <EditComponent board_id={params.board_id} />
    </>
  );
  
}