import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
/*
CaseCard is from material-ui simple card: https://v4.mui.com/components/cards/#card
1. 記得要換 function name to CaseCard 跟file name 一致
2. 傳 props from Map.js:
   {props.firstTitle} = country
   {props.secondTitle} = state
   Confirmed: {props.confirmed} = point.confirmed
   Death: {props.death} = point.death
 */
const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function CaseCard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {props.firstTitle}
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.secondTitle}
                </Typography>
                <Typography variant="body2" component="p">
                    Confirmed: {props.confirmed}
                </Typography>
                <Typography variant="body2" component="p">
                    Death: {props.death}
                </Typography>
            </CardContent>
        </Card>
    );
}
