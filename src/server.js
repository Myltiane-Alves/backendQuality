// import app from './app.js';
// const PORT = process.env.PORT || 6001;

// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta `, PORT);
// });

import app from './app.js';
import serverless from 'serverless-http';

export const handler = serverless(app);
