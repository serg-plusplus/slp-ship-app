import { Contract, providers, BigNumber as EthersBigNumber } from "ethers";
import BigNumber from "bignumber.js";
import erc20Abi from "./erc20abi.json";

export async function ensureAllowance(
  provider: providers.Web3Provider,
  account: string,
  spenderAddress: string,
  tokenAddress: string,
  minAllowance: BigNumber
) {
  if (!account || !provider) {
    throw new Error("You need to login to increase allowance");
  }

  const erc20Contract = new Contract(
    tokenAddress,
    erc20Abi,
    provider.getSigner()
  );

  const allowance: EthersBigNumber = await erc20Contract.allowance(
    account,
    spenderAddress
  );

  if (minAllowance.isGreaterThan(allowance.toString())) {
    await erc20Contract.approve(
      spenderAddress,
      EthersBigNumber.from(minAllowance.toFixed())
    );

    let newAllowance = allowance;
    while (newAllowance.toString() === allowance.toString()) {
      await new Promise((res) => setTimeout(res, 1000));
      newAllowance = await erc20Contract.allowance(account, spenderAddress);
    }
  }
}
