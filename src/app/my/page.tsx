import Header from "@/app/_component/universal/Header";
import Search from "@/app/_component/universal/Search"
import MySellList from "@/app/_component/my/MySellList";


export default function MyPage() {
  return (
    <>
        <Header />
        <Search />        
        <MySellList />      
    </>
  );
  
}