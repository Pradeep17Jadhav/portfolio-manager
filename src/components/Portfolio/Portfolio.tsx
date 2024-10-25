import { useEffect, useState } from "react";
import { stockInfoGeneratorAll, getPnL } from "../../helpers/price";
import "./styles.css";
import { sort } from "../../helpers/sort";
import {
  HoldingSummary,
  Order,
  StockInformation,
} from "../../types/transaction";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";
import useQueryParams from "../../hooks/useQueryParams";
import useMarketData from "../../hooks/useMarketData";
import useUserHoldings from "../../hooks/useUserHoldings";

export const Portfolio = () => {
  const [stocksInfo, setStocksInfo] = useState<StockInformation[]>([]);
  const [holdingSummary, setHoldingSummary] = useState<HoldingSummary>({
    totalPnl: "0",
    totalInvestedValue: "0",
    totalCurrentValue: "0",
    totalPnlPercentage: "0",
    totalDayChange: "0",
    totalDayChangePercentage: "0",
  });

  const { marketData } = useMarketData();
  const { userHoldings } = useUserHoldings();
  useQueryParams(userHoldings);

  useEffect(() => {
    if (!userHoldings || !marketData || !marketData.length) return;
    const stockInfo = stockInfoGeneratorAll(userHoldings, marketData);
    setStocksInfo(stockInfo);
    setHoldingSummary(getPnL(stockInfo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketData, marketData]);

  const onSort = (column: string, order: Order) =>
    setStocksInfo(sort(stocksInfo, column, order));

  return (
    <>
      <HoldingTable stocksInfo={stocksInfo} onSort={onSort} />
      <HoldingInformation holdingInfo={holdingSummary} />
    </>
  );
};
