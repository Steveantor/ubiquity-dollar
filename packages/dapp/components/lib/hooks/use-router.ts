import { useEffect, useState } from "react";
import { AlphaRouter } from "@uniswap/smart-order-router";
import { Percent, TradeType } from "@uniswap/sdk-core";
import useWeb3 from "@/components/lib/hooks/use-web-3";
import { uAD_TOKEN, uCR_TOKEN, USDC_TOKEN, USDT_TOKEN, DAI_TOKEN, parseAmount } from "../utils";

const useRouter = (selectedToken: string, amountIn = "0"): [string | undefined, string | undefined] => {
  const { provider, walletAddress } = useWeb3();
  const [quoteAmount, setQuoteAmount] = useState<string | undefined>();
  const [lastQuoteAmount, setLastQuoteAmount] = useState<string | undefined>();

  async function getQuote() {
    let selectedTokenObject;
    const parsedAmountIn = parseAmount(amountIn, uCR_TOKEN);

    if (selectedToken === "USDC") {
      selectedTokenObject = USDC_TOKEN;
    } else if (selectedToken === "DAI") {
      selectedTokenObject = DAI_TOKEN;
    } else if (selectedToken === "USDT") {
      selectedTokenObject = USDT_TOKEN;
    } else {
      selectedTokenObject = uAD_TOKEN;
    }

    if (provider && walletAddress) {
      const router = new AlphaRouter({ chainId: 1, provider: provider });

      const route1 = await router.route(parsedAmountIn, uAD_TOKEN, TradeType.EXACT_INPUT, {
        recipient: walletAddress,
        slippageTolerance: new Percent(5, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
      });
      setQuoteAmount(route1?.quote.toFixed(2));

      console.log("Expected uAD Value : ", route1?.quote.toFixed(2));

      if (route1 && selectedToken !== "uAD") {
        const parsed_uAD_amount = parseAmount(route1.quote.toFixed(2), uAD_TOKEN);

        const route2 = await router.route(parsed_uAD_amount, selectedTokenObject, TradeType.EXACT_INPUT, {
          recipient: walletAddress,
          slippageTolerance: new Percent(5, 100),
          deadline: Math.floor(Date.now() / 1000 + 1800),
        });
        console.log(`Expected ${selectedToken} Value : `, route2?.quote.toFixed(2));
        setLastQuoteAmount(route2?.quote.toFixed(2));
      }
    }
  }

  useEffect(() => {
    getQuote();
  }, [selectedToken, amountIn]);

  return [quoteAmount, lastQuoteAmount];
};

export default useRouter;
