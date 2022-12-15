import React, { useCallback, useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Bank from '../Bank';
import { makeStyles } from '@material-ui/core/styles';
import useBombStats from '../../hooks/useBombStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import { roundAndFormatNumber } from '../../0x';
import { Box, Card, CardContent, Button, Typography, Grid,Table, TableCell, TableBody, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useTokenBalance from '../../hooks/useTokenBalance';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';


import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';
//boardroom
import useBombFinance from '../../hooks/useBombFinance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import Label from '../../components/Label';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useStatsForPool from '../../hooks/useStatsForPool';
import useBank from '../../hooks/useBank';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import { AddIcon, RemoveIcon } from '../../components/icons';
import IconButton from '../../components/IconButton';
import useRedeem from '../../hooks/useRedeem';
import useStakeToBoardroom from '../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../hooks/useWithdrawFromBoardroom';
import useModal from '../../hooks/useModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import ExchangeStat from './components/ExchangeStat';
import useStakedBalance from '../../hooks/useStakedBalance';
import ExchangeCard from './components/ExchangeCard';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useStake from '../../hooks/useStake';
import useWithdraw from '../../hooks/useWithdraw';



import HomeImage from '../../assets/img/background.jpg';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | Boardroom';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        height: '100%',
        [theme.breakpoints.up('md')]: {
            height: '220px',
        },
    }, 
 trHeight: {
        height: '100%',
        [theme.breakpoints.up('md')]: {
            height: '50px',
        },
    },
}));





const Boardroom = () => {
    const classes = useStyles();
    const { account } = useWallet();
    const { onRedeem } = useRedeemOnBoardroom();
    const stakedBalance = useStakedBalanceOnBoardroom();
    const bondStat = useBondStats();
    const currentEpoch = useCurrentEpoch();
    const bombFinance = useBombFinance();
    const bondBalance = useTokenBalance(bombFinance?.BBOND);
    const addTransaction = useTransactionAdder();




    const handleRedeemBonds = useCallback(
        async (amount) => {
            const tx = await bombFinance.redeemBonds(amount);
            addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
        },
        [bombFinance, addTransaction],
    );
    const cashPrice = useCashPriceInLastTWAP();
    const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);



    const canWithdrawFromBoardroom = useWithdrawCheck();
    const totalStaked = useTotalStakedOnBoardroom();
    const boardroomAPR = useFetchBoardroomAPR();
    const canClaimReward = useClaimRewardCheck();
    const canWithdraw = useWithdrawCheck();
   
    const { to } = useTreasuryAllocationTimes();


    const  bankId = "BombBtcbLPBShareRewardPool"
    const bankId2 = "BshareBnbLPBShareRewardPool"
   
    const bank = useBank(bankId);
    const bank2 = useBank(bankId2);
    
    const statsOnPool = useStatsForPool(bank);
    const statsOnPool2 = useStatsForPool(bank2);

    

    const stakedBalance1 = useStakedBalance(bank.contract, bank.poolId);
    const stakedBalance2 = useStakedBalance((bank2.contract, bank2.poolId))
    const { onStake } = useStakeToBoardroom();
    const { onWithdraw } = useWithdrawFromBoardroom();

    const { onStake1 } = useStake(bank)
    const { onStake2 } = useStake(bank2)

    const { onWithdraw1 } = useWithdraw(bank);
    const { onWithdraw2 } = useWithdraw(bank2);

   
    const tokenBalance = useTokenBalance(bombFinance.BSHARE);
    const tokenBalance1 = useTokenBalance(bank.depositToken);
    const tokenBalance2= useTokenBalance(bank2.depositToken);
    const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);
    const [approveStatus1, approve1] = useApprove(bank.depositToken, bank.address);
    const [approveStatus2, approve2] = useApprove(bank2.depositToken, bank2.address);
    const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
    const tokenPriceInDollars = useMemo(
        () =>
            stakedTokenPriceInDollars
                ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
                : null,
        [stakedTokenPriceInDollars, stakedBalance],
    );


    const bombStats = useBombStats();
    const earnings = useEarningsOnBoardroom();
    const tokenPriceInDollar = useMemo(
        () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
        [bombStats],
    );
    const earnedInDollars = (Number(tokenPriceInDollar) * Number(getDisplayBalance(earnings))).toFixed(2);


   
    const bombPriceInDollars = useMemo(
        () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
        [bombStats],
    );
    const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
    const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
    const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

    const bShareStats = usebShareStats();
    const bSharePriceInDollars = useMemo(
        () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
        [bShareStats],
    );
    const bSharePriceInBNB = useMemo(
        () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
        [bShareStats],
    );
    const bShareCirculatingSupply = useMemo(
        () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
        [bShareStats],
    );
    const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

    const tBondStats = useBondStats();
    const tBondPriceInDollars = useMemo(
        () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
        [tBondStats],
    );
    const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
    const tBondCirculatingSupply = useMemo(
        () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
        [tBondStats],
    );
    const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);


    const [onPresentDeposit, onDismissDeposit] = useModal(
        <DepositModal
            max={tokenBalance}
            onConfirm={(value) => {
                onStake(value);
                onDismissDeposit();
            }}
            tokenName={'BShare'}
        />,
    );

    const [onPresentWithdraw, onDismissWithdraw] = useModal(
        <WithdrawModal
            max={stakedBalance}
            onConfirm={(value) => {
                onWithdraw(value);
                onDismissWithdraw();
            }}
            tokenName={'BShare'}
        />,
    );

    const [onPresentDeposit1, onDismissDeposit1] = useModal(
        <DepositModal
            max={tokenBalance1}
            decimals={bank.depositToken.decimal}
            onConfirm={(amount) => {
                if (Number(amount) <= 0 || isNaN(Number(amount))) return;
                onStake1(amount);
                onDismissDeposit1();
            }}
            tokenName={bank.depositTokenName}
        />,
    );
    const [onPresentWithdraw1, onDismissWithdraw1] = useModal(
        <WithdrawModal
            max={stakedBalance1}
            decimals={bank.depositToken.decimal}
            onConfirm={(amount) => {
                if (Number(amount) <= 0 || isNaN(Number(amount))) return;
                onWithdraw1(amount);
                onDismissWithdraw1();
            }}
            tokenName={bank.depositTokenName}
        />,
    );
    const [onPresentDeposit2, onDismissDeposit2] = useModal(
        <DepositModal
            max={tokenBalance2}
            decimals={bank2.depositToken.decimal}
            onConfirm={(amount) => {
                if (Number(amount) <= 0 || isNaN(Number(amount))) return;
                onStake2(amount);
                onDismissDeposit2();
            }}
            tokenName={bank2.depositTokenName}
        />,
    );
    const [onPresentWithdraw2, onDismissWithdraw2] = useModal(
        <WithdrawModal
            max={stakedBalance2}
            decimals={bank2.depositToken.decimal}
            onConfirm={(amount) => {
                if (Number(amount) <= 0 || isNaN(Number(amount))) return;
                onWithdraw2(amount);
                onDismissWithdraw2();
            }}
            tokenName={bank2.depositTokenName}
        />,
    );

    return (
        <Page>
            <BackgroundImage />
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                BOMB FINANCE SUMMARY
            </Typography>
            <Grid container justify="center"  >

                <Grid item sx={{ minWidth: 550 }} className={classes.gridItem}>
                    <Card className={classes.gridItem}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 550 }} size="small" aria-label="a dense table">

                                    <TableHead>
                                        <TableRow >

                                            <TableCell></TableCell>
                                            <TableCell  align="right">Current Supply</TableCell>
                                            <TableCell align="right">Total Supply</TableCell>
                                            <TableCell align="center">Price</TableCell>
                                            <TableCell> </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        <TableRow
                                            className={classes.trHeight}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                $BOMB
                                            </TableCell>
                                            <TableCell align="right">{roundAndFormatNumber(bombCirculatingSupply, 2)}</TableCell>
                                            <TableCell align="right">{roundAndFormatNumber(bombTotalSupply, 2)}</TableCell>
                                            <TableCell align="right"> ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'} / {bombPriceInBNB ? bombPriceInBNB : '-.----'} BNB</TableCell>
                                            <TableCell align="right">METAMASK</TableCell>
                                        </TableRow>
                                        <TableRow
                                            className={classes.trHeight}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                $BSHARE
                                            </TableCell>
                                            <TableCell align="right">{roundAndFormatNumber(bShareCirculatingSupply, 2)}</TableCell>
                                            <TableCell align="right">{roundAndFormatNumber(bShareTotalSupply, 2)}</TableCell>
                                            <TableCell align="right">  ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'} /  {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB</TableCell>
                                            <TableCell align="right">METAMASK</TableCell>
                                        </TableRow>
                                        <TableRow
                                            className={classes.trHeight}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell  component="th" scope="row">
                                                $BBOND
                                            </TableCell>
                                            <TableCell align="right">{roundAndFormatNumber(tBondCirculatingSupply, 2)} </TableCell>
                                            <TableCell align="right">{roundAndFormatNumber(tBondTotalSupply, 2)}</TableCell>
                                            <TableCell align="right">${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} /{tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BNB</TableCell>
                                            <TableCell align="right">METAMASK</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sx={{ minWidth: 650 }}  className={classes.gridItem}>
                   
                    <Card className={classes.gridItem}>
                        <CardContent style={{ textAlign: 'center' }}>


                            <Box sx={{  height: '11vh' }} >
                                <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Current Epoch</Typography>
                                <Typography>{Number(currentEpoch)}</Typography>
                            </Box>
                            <Box sx={{ height: '11vh' }} >
                                <Typography><ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" /></Typography>
                                <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Next Epoch in</Typography>
                            </Box>
                           
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box mt={3}>
               

                <Grid container justify="center">
                   
                    <Box  style={{ width: '71%' }}>
              
                        
                        <Card style={{ height: "100%" }} >
                            <CardContent >
                                <Grid container justify="center" spacing={1}>
                                    <Grid item >
                                        <Card>
                                            <CardContent align="center">
                                                <StyledCardsWrapper mt={1}> <h4 >Chat on Discord</h4></StyledCardsWrapper>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <StyledCardsWrapper mt={1}> <h4 >Read Docs</h4></StyledCardsWrapper>

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Grid container  spacing={1}>
                                    <Grid item  >
                                        <h3>Boardroom</h3>
                                        <h7>Stake BSHARE and earn BOMB every EPOCH </h7>
                                    </Grid>
                                    <Grid style={{ marginLeft: "80px" }} item align="center" >
                                        <h3>Total Stacked</h3>
                                        <h7> {getDisplayBalance(totalStaked)}</h7>
                                    </Grid>



                                </Grid>
                                
                                <Grid container justify="center" spacing={1}>
                                    <Grid item >
                                        <Card>
                                            <CardContent align="center">
                                                <h3>Daily Return</h3>
                                                <Typography>{boardroomAPR.toFixed(2)}%</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <Label text={'Your Stake'} variant="yellow" />
                                                <Typography>{getDisplayBalance(stakedBalance)}</Typography>
                                                <Typography>≈ ${tokenPriceInDollars}</Typography>                                              
                                                
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <Label text={'Earned'} variant="yellow" />
                                                <Typography>{getDisplayBalance(earnings)}</Typography>
                                                <Typography>≈ ${earnedInDollars}</Typography>
                                              
                                               
                                                
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">                                             
                                                <StyledCardActions>
                                                    {approveStatus !== ApprovalState.APPROVED ? (
                                                        <Button
                                                            disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                                                            className={approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
                                                            style={{ marginTop: '0px' }}
                                                            onClick={approve}
                                                        >
                                                            Deposit BSHARE
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <IconButton disabled={!canWithdrawFromBoardroom} onClick={onPresentWithdraw}>
                                                                <RemoveIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                                                            </IconButton>
                                                            <StyledActionSpacer />
                                                            <IconButton onClick={onPresentDeposit}>
                                                                <AddIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                </StyledCardActions>

                                                {!account && (
                                                <Grid container justify="center" spacing={3} >
                                                 
                                                        <UnlockWallet style={{ marginTop: "20px " }}
                                                            className="shinyButtonSecondary" />

                                                    </Grid>
                                                )}
                                                {!!account && (
                                                   
                                                        <Grid container justify="center" spacing={3} >
                                                            <Button
                                                                disabled={stakedBalance.eq(0) || ( !canClaimReward)}
                                                            onClick={onRedeem}
                                                            style={{ marginTop:"20px "}}
                                                                className={
                                                                    stakedBalance.eq(0) || ( !canClaimReward)
                                                                        ? 'shinyButtonDisabledSecondary'
                                                                        : 'shinyButtonSecondary'
                                                                }
                                                            >
                                                                Claim
                                                        </Button>
                                                        <Button
                                                            disabled={stakedBalance.eq(0) || (!canWithdraw)}
                                                            onClick={onRedeem}
                                                            style={{ marginTop: "20px " }}
                                                            className={
                                                                stakedBalance.eq(0) || (!canWithdraw)
                                                                    ? 'shinyButtonDisabledSecondary'
                                                                    : 'shinyButtonSecondary'
                                                            }
                                                        >
                                                            Withdraw
                                                        </Button>
                                                       
                                                      
                                                        </Grid>
                                                    
                                                )}
                                                
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                 
                                </Grid>
                            </CardContent>
                        </Card>
                            </Box>
                        
                    <Box style={{ width: '29%' }}>
                        <Alert style={{ height: "305px" }} variant="filled" severity="info">
                            <h2>Latest News </h2>
                           
                        </Alert>
                    </Box>

                       
                </Grid>

            </Box>

            <Box mt={2}>


                <Grid container justify="center">

                    <Box  style={{ width: '100%' }}>

                       <Card style={{ height: "100%" }} >
                            <CardContent >
                               
                                <Grid container spacing={1}>
                                    <Grid item >
                                        <h3>BOMB FARM</h3>
                                        <h7>Stake your LP tokens in our farm to start earning $BSHARE </h7>
                                    </Grid>
                                    



                                </Grid>
                                <Grid mt={10} style={{ marginTop: "30px " }} container spacing={1}>
                                    <Grid item >
                                        <h4>BOMB-BTCB 

                                        </h4>
                                       
                                    </Grid>




                                </Grid>
                                <Grid container  spacing={1}>
                                    <Grid item >
                                        <Card>
                                            <CardContent align="center">
                                                <h3>Daily Return</h3>
                                                <Typography>{statsOnPool?.dailyAPR}%</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <Label text={'Your Stake'} variant="yellow" />
                                                <Typography>{getDisplayBalance(stakedBalance1)}</Typography>
                                                <Typography>≈ ${tokenPriceInDollars}</Typography>

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <Label text={'Earned'} variant="yellow" />
                                                <Typography>{getDisplayBalance(earnings)}</Typography>
                                                <Typography>≈ ${earnedInDollars}</Typography>



                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">



                                              
                                                   
                                                        {approveStatus1 !== ApprovalState.APPROVED ? (
                                                            <Button
                                                                disabled={
                                                                    bank.closedForStaking ||
                                                                    approveStatus1 === ApprovalState.PENDING ||
                                                                    approveStatus1 === ApprovalState.UNKNOWN
                                                                }
                                                                onClick={approve1}
                                                                className={
                                                                    bank.closedForStaking ||
                                                                        approveStatus1 === ApprovalState.PENDING ||
                                                                        approveStatus1 === ApprovalState.UNKNOWN
                                                                        ? 'shinyButtonDisabled'
                                                                        : 'shinyButton'
                                                                }
                                                               
                                                            >
                                                                {`Approve ${bank.depositTokenName}`}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                disabled={bank.closedForStaking}
                                                                onClick={() => (bank.closedForStaking ? null : onPresentDeposit1())}
                                                            style={{ marginLeft: "25px " }}
                                                                className={'shinyButtonSecondary'}
                                                            >
                                                                Deposit
                                                            </Button>
                                                        )}
                                                    
                                               
                                                {!!account && (
                                                    
                                                   
                                                        <Button
                                                        disabled={bank.closedForStaking}
                                                            onClick={() => (bank.closedForStaking ? null : onPresentWithdraw1())}
                                                        style={{ marginLeft: "25px " }}
                                                        className={ 'shinyButtonSecondary'  }
                                                    >
                                                       Withdraw
                                                        </Button>
                                                    

                                                )}

                                            </CardContent>
                                        </Card>
                                    </Grid>

                                </Grid>
                            </CardContent>
                            <CardContent >
                               
                               
                                <Grid mt={6} container spacing={1}>
                                    <Grid item >
                                        <h4>BSHARE-BNB</h4>
                                        
                                    </Grid>




                                </Grid>
                                <Grid container  spacing={1}>
                                    <Grid item >
                                        <Card>
                                            <CardContent align="center">
                                                <h3>Daily Return</h3>
                                                <Typography>{statsOnPool2?.dailyAPR}%</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <Label text={'Your Stake'} variant="yellow" />
                                                <Typography>{getDisplayBalance(stakedBalance2)}</Typography>
                                                <Typography>≈ ${tokenPriceInDollars}</Typography>

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <Label text={'Earned'} variant="yellow" />
                                                <Typography>{getDisplayBalance(earnings)}</Typography>
                                                <Typography>≈ ${earnedInDollars}</Typography>



                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                               
                                                   
                                                        {approveStatus2 !== ApprovalState.APPROVED ? (
                                                            <Button
                                                                disabled={
                                                                    bank2.closedForStaking ||
                                                                    approveStatus2 === ApprovalState.PENDING ||
                                                                    approveStatus2 === ApprovalState.UNKNOWN
                                                                }
                                                                onClick={approve2}
                                                                className={
                                                                    bank2.closedForStaking ||
                                                                        approveStatus2 === ApprovalState.PENDING ||
                                                                        approveStatus2 === ApprovalState.UNKNOWN
                                                                        ? 'shinyButtonDisabled'
                                                                        : 'shinyButton'
                                                                }
                                                               
                                                            >
                                                                {`Approve ${bank2.depositTokenName}`}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                disabled={bank2.closedForStaking}
                                                                onClick={() => (bank2.closedForStaking ? null : onPresentDeposit2())}
                                                            style={{ marginLeft: "25px " }}
                                                                className={'shinyButtonSecondary'}
                                                            >
                                                                Deposit
                                                            </Button>
                                                        )}
                                                    
                                              
                                                {!!account && (

                                                    
                                                        
                                                        <Button
                                                            disabled={bank2.closedForStaking}
                                                            onClick={() => (bank2.closedForStaking ? null : onPresentWithdraw2())}
                                                        style={{ marginLeft: "25px " }}
                                                            className={'shinyButtonSecondary'}
                                                        >
                                                            Withdraw
                                                        </Button>

                                                   

                                                )}

                                            </CardContent>
                                        </Card>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                  

                   


                </Grid>




               



            </Box>
            <Box mt={2} >


                <Grid container justify="center">

                    <Box style={{ width: '100%' }}>


                        <Card style={{ height: "100%" }} >
                            <CardContent >
                              
                                <Grid container spacing={1}>
                                    <Grid item  >
                                        <h3>Bonds</h3>
                                        <h7>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</h7>
                                    </Grid>
                                 

                                </Grid>

                                <Grid container justify="center" spacing={1}>
                                    <Grid item >
                                        <Card>
                                            <CardContent align="center">
                                                <ExchangeStat
                                                    tokenName="10,000 BBOND"
                                                    description="Current Price: (BOMB)^2"
                                                    price={Number(bondStat?.tokenInFtm).toFixed(4) || '-'}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <Label text={'Avaible to redeem'} variant="yellow" />
                                                <ExchangeCard
                                                   
                                                    fromToken={bombFinance.BBOND}
                                                    fromTokenName="BBOND"
                                                    toToken={bombFinance.BOMB}
                                                    toTokenName="BOMB"
                                                    priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
                                                    onExchange={handleRedeemBonds}
                                                    disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                                                    disabledDescription={!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null}
                                                />

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                

                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <StyledCardActions>
                                                    
                                                </StyledCardActions>

                                                {!account && (
                                                    <Grid container justify="center" spacing={3} >

                                                        <UnlockWallet style={{ marginTop: "20px " }}
                                                            className="shinyButtonSecondary" />

                                                    </Grid>
                                                )}
                                       

                                            </CardContent>
                                        </Card>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>



                </Grid>








            </Box>
        </Page>
    );
};

const StyledSocial = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
background-color:blue;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
 width: 100%;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;


export default Boardroom;
