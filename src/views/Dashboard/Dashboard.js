import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';

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


import HomeImage from '../../assets/img/background.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    const currentEpoch = useCurrentEpoch();
   
    const totalStaked = useTotalStakedOnBoardroom();
    const boardroomAPR = useFetchBoardroomAPR();
    const canClaimReward = useClaimRewardCheck();
    const canWithdraw = useWithdrawCheck();
   
    const { to } = useTreasuryAllocationTimes();

    
    const bombFinance = useBombFinance();
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

    return (
        <Page>
            <BackgroundImage />
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                BOMB FINANCE SUMMARY
            </Typography>
            <Grid container justify="center" spacing={3} >

                <Grid item sx={{ minWidth: 650 }} className={classes.gridItem}>
                    <Card className={classes.gridItem}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">

                                    <TableHead>
                                        <TableRow >

                                            <TableCell></TableCell>
                                            <TableCell  align="right">Current Supply</TableCell>
                                            <TableCell align="right">Total Supply</TableCell>
                                            <TableCell align="right">Price</TableCell>
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
                <Grid item sx={{ minWidth: 650 }} md={2} lg={2} className={classes.gridItem}>
                   
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
                   
                    <Box mt={3} style={{ width: '50%' }}>
                    
                            
                     
                      

                           

                       
                        
                        <Card style={{ height: "270px" }} >
                            <CardContent >
                                <Grid container justify="center" spacing={1}>
                                    <Grid item >
                                        <Card>
                                            <CardContent align="center">
                                                <StyledCardsWrapper mt={1}> <h5 >Chat on Discord</h5></StyledCardsWrapper>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item  >
                                        <Card >
                                            <CardContent align="center">
                                                <StyledCardsWrapper mt={1}> <h5 >Read Docs</h5></StyledCardsWrapper>

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" spacing={1}>
                                    <Grid item >
                                        <h3>Boardroom</h3>
                                        <h7>Stake BSHARE and earn BOMB every EPOCH </h7>
                                    </Grid>
                                    <Grid item align="center" >
                                        <h3>Total Stacked</h3>
                                        <h7> {getDisplayBalance(totalStaked)}</h7>
                                    </Grid>



                                </Grid>
                                
                                <Grid container justify="center" spacing={1}>
                                    <Grid item >
                                        <Card>
                                            <CardContent align="center">
                                                <h5>Daily Return</h5>
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
                                                <Grid container justify="center" spacing={3}  mb={10}>
                                                    <Button
                                                        disabled={stakedBalance.eq(0) || (!canClaimReward)}
                                                        onClick={onRedeem}
                                                        className={
                                                            stakedBalance.eq(0) || (!canClaimReward)
                                                                ? 'shinyButtonDisabledSecondary'
                                                                : 'shinyButtonSecondary'
                                                        }
                                                    >
                                                        Claim
                                                    </Button>
                                                    <Button
                                                        disabled={stakedBalance.eq(0) || (!canWithdraw)}
                                                        onClick={onRedeem}
                                                        mt={4}
                                                        className={
                                                            stakedBalance.eq(0) || (!canWithdraw)
                                                                ? 'shinyButtonSecondary'
                                                                : 'shinyButtonSecondary'
                                                        }
                                                    >
                                                        Withdraw
                                                    </Button>


                                                </Grid>

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
                                                       
                                                      
                                                        </Grid>
                                                    
                                                )}
                                                
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                 
                                </Grid>
                            </CardContent>
                        </Card>
                            </Box>
                        
                    <Box mt={3} mr={1} style={{ width: '30%',height:"320px" }}>
                        <Alert style={{ height: "270px" }} variant="filled" severity="info">
                            <h2>Latest News </h2>
                           
                        </Alert>
                    </Box>

                       
                </Grid>

               
              
               
                   
               

    
            </Box>

            <Box mt={1}>


                <Grid container justify="center">

                    <Box mt={1} style={{ width: '100%' }}>

                       <Card style={{ height: "480px" }} >
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
                                                <h5>Daily Return</h5>
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
                                            
                                                {!!account && (

                                                    <Grid container justify="center" spacing={3} >
                                                        <Button
                                                            disabled={stakedBalance.eq(0) || (!canClaimReward)}
                                                            onClick={onRedeem}
                                                            style={{ marginRight: "15px " }}
                                                            className={
                                                                stakedBalance.eq(0) || (!canClaimReward)
                                                                    ? 'shinyButtonDisabledSecondary'
                                                                    : 'shinyButtonSecondary'
                                                            }
                                                        >
                                                            Claim
                                                        </Button>
                                                        <Button
                                                            disabled={stakedBalance.eq(0) || (!canClaimReward)}
                                                            onClick={onRedeem}
                                                            style={{ marginRight: "15px " }}
                                                            className={
                                                                stakedBalance.eq(0) || (!canClaimReward)
                                                                    ? 'shinyButtonDisabledSecondary'
                                                                    : 'shinyButtonSecondary'
                                                            }
                                                        >
                                                            Claim
                                                        </Button>
                                                        <Button
                                                            disabled={stakedBalance.eq(0) || (!canWithdraw)}
                                                            onClick={onRedeem}
                                                            style={{ marginRight: "15px " }}
                                                            className={
                                                                stakedBalance.eq(0) || (!canWithdraw)
                                                                    ? 'shinyButtonSecondary'
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
                                                <h5>Daily Return</h5>
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
                                            
                                                {!!account && (

                                                    <Grid container justify="center" spacing={3} >
                                                        <Button
                                                            disabled={stakedBalance.eq(0) || (!canClaimReward)}
                                                            onClick={onRedeem}
                                                            style={{ marginRight: "15px " }}
                                                            className={
                                                                stakedBalance.eq(0) || (!canClaimReward)
                                                                    ? 'shinyButtonDisabledSecondary'
                                                                    : 'shinyButtonSecondary'
                                                            }
                                                        >
                                                            Claim
                                                        </Button>
                                                        <Button
                                                            disabled={stakedBalance.eq(0) || (!canClaimReward)}
                                                            onClick={onRedeem}
                                                            style={{ marginRight: "15px " }}
                                                            className={
                                                                stakedBalance.eq(0) || (!canClaimReward)
                                                                    ? 'shinyButtonDisabledSecondary'
                                                                    : 'shinyButtonSecondary'
                                                            }
                                                        >
                                                            Claim
                                                        </Button>
                                                        <Button
                                                            disabled={stakedBalance.eq(0) || (!canWithdraw)}
                                                            onClick={onRedeem}
                                                            style={{ marginRight: "15px " }}
                                                            className={
                                                                stakedBalance.eq(0) || (!canWithdraw)
                                                                    ? 'shinyButtonSecondary'
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


export default Boardroom;
