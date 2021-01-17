import {
  Contract,
  providers,
  BigNumber as EthersBigNumber,
  ethers,
} from "ethers";
import BigNumber from "bignumber.js";
import erc20Abi from "./erc20abi.json";

export async function getBalance(
  provider: providers.Web3Provider,
  account: string,
  tokenAddress: string
) {
  if (!account || !provider) {
    throw new Error("You need to login to get balance");
  }

  if (
    !ethers.utils.isAddress(account) ||
    !ethers.utils.isAddress(tokenAddress)
  ) {
    throw new Error("Invalid Ethereum address");
  }

  const erc20Contract = new Contract(
    tokenAddress,
    erc20Abi,
    provider.getSigner()
  );

  const decimals = await erc20Contract.decimals();

  const balance: EthersBigNumber = await erc20Contract.balanceOf(account);
  return new BigNumber(balance.toString()).div(10 ** decimals).toString();
}

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
