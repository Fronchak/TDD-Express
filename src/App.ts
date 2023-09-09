import express from 'express';
import personRoutes from './Routes/personRoutes';
import PersonController from './controllers/PersonController';
import errorHandler from './errorHandling/errorHandler';

export type AppConfig = {
    personController: PersonController
}

const App = (config: AppConfig) => {
    const app = express();

    app.use(express.json());

    app.use('/people', personRoutes(config.personController));

    app.use(errorHandler);

    return app;
}

export default App;