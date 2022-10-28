import * as express from 'express';
import 'express-async-errors';
import * as methodOverride from 'method-override';
import {engine} from 'express-handlebars';
import {handleError} from './utils/errors';
import {homeRouter} from './routers/homeRouter';
import {childRouter} from './routers/childRouter';
import {giftRouter} from './routers/giftRouter';
import {handlebarsHelpers} from './utils/handlebars-helpers';
import './utils/db';
import {Application} from "express";


const app: Application = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({
    extended: true,
}));
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: handlebarsHelpers
}));
app.set('view engine', '.hbs');


app.use('/', homeRouter);

app.use('/child', childRouter);

app.use('/gift', giftRouter);


app.use(handleError);

app.listen(3000, 'localhost', () => {
    console.log('Listening on http://localhost:3000');
});
