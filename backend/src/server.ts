import app from './app';
import { PORT } from './config/env';
import logger from './utils/logger';

const PORTA = PORT || 5173;

app.listen(PORTA, () => {
    logger.info(`Server is running on port ${PORTA}`);
});
