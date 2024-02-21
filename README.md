# TokenSwap Contract

This project demonstrates a token swap contract, a test for that contract, and a script that deploys that contract.

Certainly! Let's break down the swap calculation for exchanging 1 WEB3X for YDM, considering the fee of 2% and the initial ratio of 5:

## Initial Exchange Amount:

The ratioAX (5) represents the number of YDM tokens you would receive for 1 WEB3X without fees.
So, for 1 WEB3X, the initial exchange amount (before fees) would be: exchangeA = (1 WEB3X) \* (5 YDM/WEB3X) = 5 YDM
Fee Deduction:

The contract applies a 2% fee: fees = 2
To calculate the fee amount, multiply the initial exchange amount by the fee percentage and divide by 100: feeAmount = (5 YDM) \* (2%) / 100 = 0.1 YDM
Subtract the fee amount from the initial exchange amount to get the final amount of YDM received: exchangeAmount = exchangeA - feeAmount = 5 YDM - 0.1 YDM = 4.9 YDM
Therefore, by exchanging 1 WEB3X, you would receive approximately 4.9 YDM, with a 0.1 YDM fee deducted.
