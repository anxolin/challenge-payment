# Gnosis Protocol Challenge payout

Ad-hoc script that transforms a leader-board in Dune into payment file consumed by the **multisend** script in
[https://github.com/gnosis/dex-liquidity-provision](https://github.com/gnosis/dex-liquidity-provision/)

> **NOTE**:
> Just short lived repo for generating a JSON file for the payment of Gnosis Protocol Challenge:
> https://explore.duneanalytics.com/public/dashboards/aPV5YhphBMyc6I0aRKdGwu4RDMI9xqZ30qcn8FTL
>
> Probably, this code can be in the future generalized and adapted for other possible uses. For now. Let's keep it simple 🏄‍♂️

## Setup dependencies

```bash
yarn install
```

## About the input file

Generated automatically by exporting the leader board in [https://explore.duneanalytics.com/public/dashboards/aPV5YhphBMyc6I0aRKdGwu4RDMI9xqZ30qcn8FTL](https://explore.duneanalytics.com/public/dashboards/aPV5YhphBMyc6I0aRKdGwu4RDMI9xqZ30qcn8FTL)

The file has the following format:

```csv
position,trader,score,gno_estimation,score_raw,balance
1,0x78e96be52e38b3fc3445a2ed34a6e586ffab9631,435298.31080171285,441.86302453452646,3510245578.305012,41724.45940213918
2,0xe7883853a6dbaa4d91112ae4c01dca8ea15cfb25,160998.67825051356,163.42669188587416,1298293341.4121413,91.62644323809721
3,0x7917327672d0f19f6b27c7eaf4dd6b9fc72c2db1,60234.839221743,61.14323805174196,485733743.48413557,0.0
4,0x36b0f5c5780ec9c31c1d04aef76a07a35d564c2b,59418.236016686824,60.31431969144288,479148655.2385625,96614.61457628643
```

Check out an example in [data/leader-board-example.csv](data/leader-board-example.csv).

## Generate payments files

```bash
# yarn gen <input-file> <output-file>
yarn gen data/leader-board-example.csv gno-payments.json
```
