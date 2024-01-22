import { JsonRpc } from "eosjs";
import { TradeParams } from "@/types/hep_trade";

export async function ReadTradeTrx(params: TradeParams) {
  const rpc = new JsonRpc("http://14.63.34.160:8888");

  const {
    sort_type,
    bound,
    page,
    perPage,
    filter_datas = [0, 100000],
    selectFilter,
  } = params;

  console.log("params : ",params)

  // 페이지 번호에 따라 시작과 끝을 계산
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage - 1;

  // 검색 유형을 정해준다. 1 : sale id, 2 : collection, 3 : seller, 4 : asset name, 5 : buyer, 6 : is sale, 7 : schema, 8: asset_id
  let index = 0;
  let key_type = "";

  switch (sort_type) {
    case "transaction_id":
      index = 1;
      key_type = "i64";
      break;
    case "byseller":
      index = 2;
      key_type = "name";
      break;
    case "bybuyer":
      index = 3;
      key_type = "name";
      break;
    case "bysellconf":
      index = 4;
      key_type = "i64";
      break;
    case "bysellconf":
      index = 5;
      key_type = "i64";
      break;
    case "bytrxcom":
      index = 6;
      key_type = "i64";
      break;
    case "is_fraud":
      index = 7;
      key_type = "i64";
      break;
    case "bytrxid":
      index = 8;
      key_type = "i64";
      break;
    default:
      return { result: "sort_type 오류입니다." };
  }

  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: "eosio.item",
      scope: "eosio.item",
      table: "transactions",
      index_position: index,
      key_type: key_type,
      lower_bound: bound[0],
      upper_bound: bound[1],
      limit: 10000,
    });

    console.log(`ReadTradeTrx 응답값 : `, response);
    // let data;
    // data = response.rows
    //   .filter(item => {
    //     let parts = item.price.split(' ');
    //     let number = parseInt(parts[0]);
    //     return filter_datas[0] <= number && number <= filter_datas[1];
    //   })
    //   .sort((a,b) =>{ 
    //     if(selectFilter === "recent") {
    //       return b.sale_id - a.sale_id
    //     } else if(selectFilter === "old"){
    //       return a.sale_id - b.sale_id
    //     } else if(selectFilter === "alpha"){
    //       return a.asset_name.localeCompare(b.asset_name);          
    //     } else if(selectFilter === "reverseAlpha"){
    //       return b.asset_name.localeCompare(a.asset_name);          
    //     }
    //   })
    //   .slice(startIndex, endIndex + 1);
    
    // console.log(`ReadTradeTrx 최종 결과값 : `, data);
    // return { result: data };
  } catch (error) {
    console.error(`ReadTradeTrx 오류 : `, error);
    throw error; // 발생한 오류를 호출자에게 전달하기 위해 에러를 다시 던집니다.
  }
}
