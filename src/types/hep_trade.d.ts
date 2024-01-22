export type TradeParams = {
    sort_type: string;
    bound: (string[] | number[]);
    page: number;
    perPage: number;
    filter_datas: number[];
    selectFilter?: string; // 선택적으로 사용할 수 있는 속성
  };