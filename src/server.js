import app from './app.js';
const PORT =  6001;
// const PORT =  'http://164.152.244.96:6001';
// const PORT =  'https://confidencial-api.vercel.app';


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta `, PORT);
});

